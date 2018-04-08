import { NgfmConnector } from '../ngfm-connector';
import { Injectable, Inject } from '@angular/core';
import { NgfmFolder } from '../../models/ngfm-folder';
import { Observable } from 'rxjs/Observable';
import { NgfmItem } from '../../models/ngfm-item';
import { NgfmFile } from '../../models/ngfm-file';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders, HttpRequest, HttpEventType } from '@angular/common/http';
import { NgfmRestConfig } from './ngfm-rest.config';
import { map, tap, switchMap, filter, last } from 'rxjs/operators';
import { NGFM_REST_CONFIG } from '../constants';
import { zip } from 'rxjs/observable/zip';
import { HttpUploadProgressEvent } from '@angular/common/http/src/response';
import { NgfmProgress } from '../ngfm-progress';
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
        const url = [...this.base, ...folder.fullPath, ''].join('/');
        return this.http.get<NgfmItem[]>(url).pipe(
            map(data => data.map(obj => this.createItem(folder, obj))),
            map(data => data.sort((a, b) => a.isFolder === b.isFolder ? (a.created > b.created ? -1 : 1) : a.isFolder ? -1 : 1))
        );
    }
    private getFullPath(item: NgfmItem) {
        return [...this.base, ...item.fullPath].join('/');
    }
    private createItem(parent: NgfmFolder, data: any) {
        return data.itemType === 'file' ? new NgfmFile(parent, data) : new NgfmFolder(parent.root, [...parent.path, data.name]);
    }
    mkDir(folder: NgfmFolder): Observable<NgfmFolder> {
        return this.http.post<any>([...this.base, ...folder.fullPath].join('/'), {}).pipe(
            map(() => folder)
        );
    }
    rmDir(folder: NgfmFolder): Observable<NgfmFolder> {
        return this.http.delete<any>([...this.base, ...folder.fullPath].join('/'), {}).pipe(
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
    uploadFile(file: NgfmFile): NgfmProgress {
        const data: FormData = new FormData();
        data.append('file', file.nativeFile);
        const headers = new HttpHeaders();
        headers.set('Content-Length', String(file.nativeFile.size));
        const req = new HttpRequest('POST', [...this.base, ...file.fullPath].join('/'), data, { responseType: 'json', reportProgress: true });
        const progress = this.http.request(req).pipe(
            filter(evt => evt.type === HttpEventType.UploadProgress),
            map((evt: HttpUploadProgressEvent) =>
                evt.loaded / evt.total
            ));
        return {
            progress,
            success: progress.pipe(
                last(),
                map(() => true)
            )
        };
    }

    rename(item: NgfmItem, newName: string): Observable<void> {
        return this.http.head(this.getFullPath(item), { observe: 'response', responseType: 'json' }).pipe(
            switchMap((res: HttpResponse<null>) => {
                // TODO: use x-ngfm-hash header instead of content-type as soon as
                // HttpResponse not showing any custom headers gets fixed.
                const hash = res.headers.get('content-type').split(/\/|\;/)[1];
                const params = new HttpParams().append('from', hash);
                const newPath = item.fullPath;
                newPath.pop();
                newPath.push(newName);
                return this.http.post([...this.base, ...newPath].join('/'), {}, { params: params })
            }),
            map(() => null)
        );
    }
}
