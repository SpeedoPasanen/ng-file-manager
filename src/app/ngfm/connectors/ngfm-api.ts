import { Injectable, Inject, EventEmitter } from '@angular/core';
import { NgfmFolder } from '../models/ngfm-folder';
import { Observable } from 'rxjs/Observable';
import { NgfmItem } from '../models/ngfm-item';
import { NgfmFile } from '../models/ngfm-file';
import { NGFM_CONNECTOR } from './constants';
import { MatDialog, MatSnackBarConfig, MatSnackBar, MatSnackBarRef } from '@angular/material';
import { NgfmUploadDialogComponent } from '../upload-dialog/ngfm-upload-dialog.component';
import { NgfmBrowserDialogComponent } from '../browser-dialog/ngfm-browser-dialog.component';
import { NgfmConnector } from './ngfm-connector';
import { Subscriber } from 'rxjs/Subscriber';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { take, tap, last, catchError, takeUntil, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { NgfmConfig } from '../models/ngfm-config';
import { NgfmDialogService } from '../dialog/ngfm-dialog.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { NgfmDownloadComponent } from '../download/ngfm-download.component';
import { NgfmProgress } from './ngfm-progress';
import { NgfmProgressSnackComponent } from '../progress-snack/ngfm-progress-snack.component';
import { timer } from 'rxjs/observable/timer';
@Injectable()
export class NgfmApi {
    busy$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    config: NgfmConfig;
    navigate: EventEmitter<NgfmFolder> = new EventEmitter();
    constructor(
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        @Inject(NGFM_CONNECTOR) public connector?: NgfmConnector
    ) {
    }
    lsSubjectMap: Map<string, BehaviorSubject<NgfmItem[]>> = new Map();
    ls(folder: NgfmFolder, filter: any = {}): BehaviorSubject<NgfmItem[]> {
        if (!this.lsSubjectMap.has(folder.hash)) {
            this.lsSubjectMap.set(folder.hash, new BehaviorSubject([]));
        }
        this.showProgress(this.connector.ls(folder, filter))
            .subscribe(items => this.lsSubjectMap.get(folder.hash).next(items));
        return this.lsSubjectMap.get(folder.hash);
    }
    mkDir(folder: NgfmFolder): NgfmProgress {
        return {
            success: this.showProgress(this.connector.mkDir(folder))
                .pipe(
                    tap(() => this.ls(folder.parent))
                )
        };
    }
    rmDir(folder: NgfmFolder, refreshWhenDone = true): Observable<any> {
        return this.showProgress(
            this.connector.rmDir(folder)
        ).pipe(tap(() => refreshWhenDone && folder.parent ? this.ls(folder.parent) : null));
    }
    rmDirs(folders: NgfmFolder[]): Observable<NgfmFolder[]> {
        return combineLatest(
            folders.map(folder => this.rmDir(folder, false))
        ).pipe(tap(() => this.ls(folders[0].parent)));
    }
    rm(file: NgfmFile, refreshWhenDone = true): Observable<NgfmFile> {
        return this.showProgress(
            this.connector.rm(file)
        ).pipe(tap(file => refreshWhenDone && this.ls(file.folder)));
    }
    rmFiles(files: NgfmFile[]): Observable<NgfmFile[]> {
        const folder = files[0].folder;
        return combineLatest(files.map(file => this.rm(file, false)))
            .pipe(tap(() => this.ls(folder)));
    }
    moveFiles(files: NgfmFile[], from: NgfmFolder, to: NgfmFolder): Observable<{ files: NgfmFile[]; from: NgfmFolder; to: NgfmFolder; }> {
        return this.showProgress(
            this.connector.moveFiles(files, from, to)
        )
            .pipe(
                tap(() => {
                    this.ls(from);
                    const sbConfig: MatSnackBarConfig = new MatSnackBarConfig();
                    sbConfig.duration = 5000;
                    this.snackBar.open(`${this.config.messages.DONE}`, `${this.config.messages.GO_TO} ${to.name}`, sbConfig)
                        .onAction().subscribe(() => {
                            this.navigate.next(to);
                        });
                })
            );
    }
    private handleError(err: HttpErrorResponse | any) {
        console.log(err);
        this.snackBar.open(`${err.message || 'Unknown error'}`, this.config.messages.CLOSE);
        return of(null);
    }
    uploadFile(file: NgfmFile): NgfmProgress {
        return this.connector.uploadFile(file);
    }
    rename(item: NgfmItem, newName: string): Observable<NgfmItem> {
        return this.showProgress(
            this.connector.rename(item, newName)
        ).pipe(tap(() => this.ls(item.isFolder ? (item as NgfmFolder).parent : (item as NgfmFile).folder)));
    }
    mkSubDir(folder: NgfmFolder, dirName: string): Observable<NgfmFolder> {
        return this.showProgress(
            this.mkDir(new NgfmFolder(folder.root, [...folder.path, dirName]))
        );
    }

    showProgress(progressObj: NgfmProgress, message = ''): Observable<any> {
        this.busy$.next(true);
        return timer(1).pipe(
            // For some weird reason, you'd get changeDetector errors from MatSnackbar without the timeout
            map(() => {
                let snack: MatSnackBarRef<NgfmProgressSnackComponent>;
                progressObj.progress.pipe(
                    tap((value) => {
                        snack = snack || this.snackBar.openFromComponent(NgfmProgressSnackComponent);
                        snack.instance.message = message;
                        snack.instance.value = value * 100;
                    }),
                    takeUntil(progressObj.success)
                ).subscribe();
                return snack;
            }),
            switchMap(snack =>
                progressObj.success.pipe(
                    catchError(err => {
                        this.busy$.next(false);
                        snack ? snack.dismiss() : null;
                        return this.handleError(err);
                    }),
                    tap(() => {
                        this.busy$.next(false);
                        snack ? snack.dismiss() : null;
                    })
                )
            )
        );
    }

    openDialog(root: string[], path: string[], dialogData: any = {}) {
        const dlg = this.dialog.open(NgfmBrowserDialogComponent, {
            width: '95vw',
            maxWidth: '95vw',
            maxHeight: '95vh',
            data: Object.assign({ root, path }, dialogData)
        });
        return dlg.afterClosed();
    }

    pickFolder(root: string[], path: string[]) {
        return this.openDialog(root, path, { pick: 'folder' });
    }
    download(file: NgfmFile) {
        this.dialog.open(NgfmDownloadComponent, { data: { file, config: this.config } });
    }

}