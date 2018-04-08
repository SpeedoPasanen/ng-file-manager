import { NgfmConnector } from '../ngfm-connector';
import { Injectable, Inject } from '@angular/core';
import { NgfmFolder } from '../../models/ngfm-folder';
import { Observable } from 'rxjs/Observable';
import { NgfmItem } from '../../models/ngfm-item';
import { NgfmFile } from '../../models/ngfm-file';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders, HttpRequest, HttpEventType } from '@angular/common/http';
import { NgfmRestConfig } from './ngfm-rest.config';
import { map, tap, switchMap, filter, last, share } from 'rxjs/operators';
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

    ls(folder: NgfmFolder, filters?: any): NgfmProgress {
        const url = [...this.base, ...folder.fullPath, ''].join('/');
        /*
                return this.http.get<NgfmItem[]>(url).pipe(
                    map(data => data.map(obj => this.createItem(folder, obj))),
                    map(data => data.sort((a, b) => a.isFolder === b.isFolder ? (a.created > b.created ? -1 : 1) : a.isFolder ? -1 : 1))
                );
                */
        const req = new HttpRequest('GET', url, { responseType: 'json', reportProgress: true });
        const httpCall = this.http.request(req).pipe(share());
        const progress = httpCall.pipe(
            filter(evt => evt.type === HttpEventType.UploadProgress),
            map((evt: HttpUploadProgressEvent) =>
                evt.loaded / evt.total
            ),
        );
        const success = httpCall.pipe(
            filter(evt => 'body' in evt),
            map((res: HttpResponse<any>) => res.body),
            map(data => data.map(obj => this.createItem(folder, obj))),
            map(data => data.sort((a, b) => a.isFolder === b.isFolder ? (a.created > b.created ? -1 : 1) : a.isFolder ? -1 : 1))
        );
        return new NgfmProgress(success, progress);
    }
    private getFullPath(item: NgfmItem) {
        return [...this.base, ...item.fullPath].join('/');
    }
    private createItem(parent: NgfmFolder, data: any) {
        return data.itemType === 'file' ? new NgfmFile(parent, data) : new NgfmFolder(parent.root, [...parent.path, data.name]);
    }
    mkDir(folder: NgfmFolder): NgfmProgress {
        return new NgfmProgress(
            this.http.post<any>([...this.base, ...folder.fullPath].join('/'), {}).pipe(
                map(() => true)
            )
        );
    }
    rmDir(folder: NgfmFolder): NgfmProgress {
        return new NgfmProgress(
            this.http.delete<any>([...this.base, ...folder.fullPath].join('/'), {}).pipe(
                map(() => true)
            )
        );
    }
    rm(file: NgfmFile): NgfmProgress {
        return new NgfmProgress(
            this.http.delete<any>(this.getFullPath(file)).pipe(
                map(() => true)
            )
        );
    }
    moveFiles(files: NgfmFile[], from: NgfmFolder, to: NgfmFolder): NgfmProgress {
        return new NgfmProgress(
            zip(...files.map(file => this.moveFile(file, from, to).success)).pipe(
                map(() => true)
            )
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
        return new NgfmProgress(
            progress.pipe(
                last(),
                map(() => true)
            ),
            progress
        );
    }

    moveFile(file: NgfmFile, from: NgfmFolder, to: NgfmFolder): NgfmProgress {
        return new NgfmProgress(
            this.http.head(this.getFullPath(file), { observe: 'response', responseType: 'json' }).pipe(
                switchMap((res: HttpResponse<null>) => {
                    const hash = res.headers.get('x-ngfm-Hash');
                    const params = new HttpParams().append('from', hash);
                    return this.http.post([...this.base, ...to.fullPath, file.name].join('/'), {}, { params: params })
                }),
                map(() => true)
            )
        );
    }
    rename(item: NgfmItem, newName: string): NgfmProgress {
        return new NgfmProgress(
            this.http.head(this.getFullPath(item), { observe: 'response', responseType: 'json' }).pipe(
                switchMap((res: HttpResponse<null>) => {
                    const hash = res.headers.get('x-ngfm-Hash');
                    const params = new HttpParams().append('from', hash);
                    const newPath = item.fullPath;
                    newPath.pop();
                    newPath.push(newName);
                    return this.http.post([...this.base, ...newPath].join('/'), {}, { params: params })
                }),
                map(() => true)
            )
        );
    }
}
