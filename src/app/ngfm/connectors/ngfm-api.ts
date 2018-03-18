import { Injectable, Inject } from '@angular/core';
import { NgfmFolder } from '../models/ngfm-folder';
import { Observable } from 'rxjs/Observable';
import { NgfmItem } from '../models/ngfm-item';
import { NgfmFile } from '../models/ngfm-file';
import { NGFM_CONNECTOR } from './constants';
import { MatDialog } from '@angular/material';
import { NgfmUploadDialogComponent } from '../upload-dialog/ngfm-upload-dialog.component';
import { NgfmBrowserDialogComponent } from '../browser-dialog/ngfm-browser-dialog.component';
import { NgfmConnector } from './ngfm-connector';
import { Subscriber } from 'rxjs/Subscriber';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { take, tap, last } from 'rxjs/operators';
@Injectable()
export class NgfmApi {
    constructor(
        private dialog: MatDialog,
        @Inject(NGFM_CONNECTOR) public connector: NgfmConnector
    ) { }
    lsSubjectMap: Map<string, BehaviorSubject<NgfmItem[]>> = new Map();
    ls(folder: NgfmFolder, filter: any = {}): BehaviorSubject<NgfmItem[]> {
        console.log('api.ls');
        if (!this.lsSubjectMap.has(folder.hash)) {
            this.lsSubjectMap.set(folder.hash, new BehaviorSubject([]));
        }
        this.pipeOverlay(this.connector.ls(folder, filter).pipe(take(1)))
            .subscribe(items => this.lsSubjectMap.get(folder.hash).next(items));
        return this.lsSubjectMap.get(folder.hash);
    }
    mkDir(folder: NgfmFolder): Observable<NgfmFolder> {
        this.showOverlay(true);
        return this.pipeOverlay(this.connector.mkDir(folder))
            .pipe(tap((f: NgfmFolder) => this.ls(folder.parent)));
    }
    rmDir(folder: NgfmFolder, refreshWhenDone = true): Observable<NgfmFolder> {
        return this.pipeOverlay(
            this.connector.rmDir(folder).pipe(tap(folder => refreshWhenDone && folder.parent ? this.ls(folder.parent) : null))
        );
    }
    rmDirs(folders: NgfmFolder[]): Observable<NgfmFolder[]> {
        return this.pipeOverlay(
            combineLatest(folders.map(folder => this.rmDir(folder, false)))
                .pipe(tap(() => this.ls(folders[0].parent)))
        );
    }
    rm(file: NgfmFile, refreshWhenDone = true): Observable<NgfmFile> {
        return this.pipeOverlay(
            this.connector.rm(file)
                .pipe(tap(file => refreshWhenDone && this.ls(file.folder)))
        );
    }
    rmFiles(files: NgfmFile[]): Observable<NgfmFile[]> {
        const folder = files[0].folder;
        return this.pipeOverlay(
            combineLatest(files.map(file => this.rm(file, false)))
                .pipe(tap(() => this.ls(folder)))
        );
    }
    moveFiles(files: NgfmFile[], from: NgfmFolder, to: NgfmFolder): Observable<{ files: NgfmFile[]; from: NgfmFolder; to: NgfmFolder; }> {
        return this.pipeOverlay(
            this.connector.moveFiles(files, from, to)
                .pipe(tap(() => this.ls(from)))
        );
    }
    uploadFile(file: NgfmFile): Observable<number> {
        return this.connector.uploadFile(file);
    }
    folderExists(folder: NgfmFolder): Observable<boolean> {
        return this.connector.folderExists(folder);
    }
    fileExists(file: NgfmFile): Observable<boolean> {
        return this.connector.fileExists(file);
    }
    rename(item: NgfmItem, newName: string): Observable<NgfmItem> {
        return this.pipeOverlay(
            this.connector.rename(item, newName).pipe(tap(item => this.ls(item.isFolder ? (item as NgfmFolder).parent : (item as NgfmFile).folder)))
        );
    }
    mkSubDir(folder: NgfmFolder, dirName: string): Observable<NgfmFolder> {
        return this.pipeOverlay(
            this.mkDir(new NgfmFolder(folder.root, [...folder.path, dirName]))
        );
    }

    pipeOverlay(observable: Observable<any>): Observable<any> {
        this.showOverlay(true);
        return observable.pipe(tap(() => this.showOverlay(false)));
    }
    protected overlay = null;
    protected showOverlay(b = true) {
        if (b && (!this.overlay)) {
            this.overlay = this.createOverlay();
        }
        if (!b && (this.overlay)) {
            this.removeOverlay();
        }
    }
    protected createOverlay() {
        const ovl = document.createElement('div');
        ovl.className = 'loading-overlay';
        setTimeout(() => {
            ovl.className = 'loading-overlay visible';
        }, 5);
        const ovlIcon = document.createElement('i');
        ovlIcon.className = 'fa fa-spin fa-spinner';
        ovlIcon.style.color = '#eee';
        ovl.appendChild(ovlIcon);
        document.body.appendChild(ovl);
        return ovl;
    }
    protected removeOverlay() {
        this.overlay.className = 'loading-overlay';
        const ovl = this.overlay;
        setTimeout(() => {
            document.body.removeChild(ovl);
        }, 300);
        this.overlay = null;
    }
    openDialog(root: string[], path: string[], dialogData: any = {}) {
        const dlg = this.dialog.open(NgfmBrowserDialogComponent, {
            width: '95vw',
            maxWidth: '95vw',
            height: '95vh',
            maxHeight: '95vh',
            data: Object.assign({ root, path }, dialogData)
        });
        return dlg.afterClosed();
    }

    pickFolder(root: string[], path: string[]) {
        return this.openDialog(root, path, { pick: 'folder' });
    }


}