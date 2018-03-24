import { NgfmConnector } from '../ngfm-connector';
import { Injectable, Inject } from '@angular/core';
import { NgfmFolder } from '../../models/ngfm-folder';
import { Observable } from 'rxjs/Observable';
import { NgfmItem } from '../../models/ngfm-item';
import { NgfmFile } from '../../models/ngfm-file';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { NgfmRestConfig } from './ngfm-rest.config';
import { map, tap, switchMap } from 'rxjs/operators';
import { NGFM_REST_CONFIG } from '../constants';
import { zip } from 'rxjs/observable/zip';
@Injectable()
export class NgfmRestConnector implements NgfmConnector {
    private base: string[];
    constructor(
        private http: HttpClient,
        @Inject(NGFM_REST_CONFIG) private config: NgfmRestConfig
    ) {
        this.base = this.config.baseUrl.split('/');
    }

    ls(folder: NgfmFolder, filter?: any): Observable<NgfmItem[]> {
        return this.http.get<NgfmItem[]>(NgfmFolder.joinPath(this.base, folder.fullPath)).pipe(
            map(data => data.map(obj => this.createItem(folder, obj))),
        );
    }
    private getFullPath(item: NgfmItem) {
        return [...this.base, ...item.fullPath].join('/');
    }
    private createItem(parent: NgfmFolder, data: any) {
        return data.itemType === 'file' ? new NgfmFile(parent, data) : new NgfmFolder(parent.fullPath, [data.name]);
    }
    mkDir(folder: NgfmFolder): Observable<NgfmFolder> {
        return this.http.post<any>(NgfmFolder.joinPath(this.base, folder.fullPath), {}).pipe(
            map(() => folder)
        );
    }
    rmDir(folder: NgfmFolder): Observable<NgfmFolder> {
        return this.http.delete<any>(NgfmFolder.joinPath(this.base, folder.fullPath), {}).pipe(
            map(() => folder)
        );
    }
    rm(file: NgfmFile): Observable<NgfmFile> {
        return this.http.delete<any>(this.getFullPath(file)).pipe(
            map(() => file)
        );
    }
    moveFiles(files: NgfmFile[], from: NgfmFolder, to: NgfmFolder): Observable<{ files: NgfmFile[]; from: NgfmFolder; to: NgfmFolder; }> {
        return zip(...files.map(file => this.moveFile(file, from, to))).pipe(
            map(() => { return { files, from, to }; })
        );
    }
    moveFile(file: NgfmFile, from: NgfmFolder, to: NgfmFolder): Observable<{ file: NgfmFile; from: NgfmFolder; to: NgfmFolder; }> {
        return this.http.head(this.getFullPath(file), { observe: 'response', responseType: 'json' }).pipe(
            switchMap((res: HttpResponse<null>) => {
                // TODO: use x-ngfm-hash header instead of content-type as soon as
                // HttpResponse not showing any custom headers gets fixed.
                const hash = res.headers.get('content-type').split(/\/|\;/)[1];
                const params = new HttpParams().append('from', hash);
                return this.http.post([...this.base, ...to.fullPath, file.name].join('/'), {}, { params: params })
            }),
            map(() => { return { file, from, to }; })
        );
    }
    uploadFile(file: NgfmFile): Observable<number> {
        throw new Error("Method not implemented.");
    }
    folderExists(folder: NgfmFolder): Observable<boolean> {
        throw new Error("Method not implemented.");
    }
    fileExists(file: NgfmFile): Observable<boolean> {
        throw new Error("Method not implemented.");
    }
    rename(item: NgfmItem, newName: string): Observable<NgfmItem> {
        throw new Error("Method not implemented.");
    }
}
