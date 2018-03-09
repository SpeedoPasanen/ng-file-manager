import { Injectable } from '@angular/core';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { NgfmConnector } from './ngfm-connector';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { of } from 'rxjs/observable/of';
import { map, switchMap, takeWhile, tap, last } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class NgfmMemoryConnector implements NgfmConnector {
  private tree: any = {
    'public': { files: [] },
    'public/folder_1': { files: [] },
  };

  private getNode(folder) {
    return this.tree[folder.toString()] = this.tree[folder.toString()] || { files: [] };
  }
  private getChildren(path: string) {
    const childExpr = new RegExp(`${path}/.+`);
    const childNames = Object.keys(this.tree)
      .filter(key => childExpr.test(key))
      .map(key => key.replace(`${path}/`, '').replace(/\/.*/, ''));
    return _.uniq(childNames);
  }

  folderExists(folder: NgfmFolder): Observable<boolean> {
    return timer(400).pipe(map(() => !!this.tree[folder.toString()]));
  }
  fileExists(file: NgfmFile): Observable<boolean> {
    return this.folderExists(file.folder).pipe(
      map(folderExists => folderExists && (!!this.tree[file.folder.toString()].files.find(f => f.name === file.name)))
    );
  }
  ls(folder: NgfmFolder): Observable<{ files: NgfmFile[], folders: NgfmFolder[] }> {
    return this.mkDir(folder)
      .pipe(
        map(foo => {
          return {
            files: this.getNode(folder).files,
            folders: this.getChildren(folder.toString()).map(childName => new NgfmFolder(folder.root, [...folder.path, childName]))
          };
        })
      );
  }
  mkDir(folder: NgfmFolder): Observable<NgfmFolder> {
    return timer(300).pipe(map(foo => this.getNode(folder)));
  }
  rmDir(folder: NgfmFolder): Observable<NgfmFolder> {
    delete this.tree[folder.toString()];
    return timer(400).pipe(map(foo => folder));
  }
  rm(file: NgfmFile): Observable<NgfmFile> {
    if (!this.tree[file.folder.toString()]) {
      return of(file);
    }
    const files = this.tree[file.folder.toString()].files;
    files.splice(files.indexOf(file), 1);
    return timer(100).pipe(map(foo => file));
  }
  uploadFile(file: NgfmFile): Observable<number> {
    return this.mkDir(file.folder).pipe(
      switchMap(() => timer(0, 50)),
      map(val => Math.min(1, val / 10)),
      takeWhile(val => val < 1),
      tap(() => { }, () => { },
        () => {
          this.getNode(file.folder).files = _.uniqBy([...this.getNode(file.folder).files, file], f => f.name)
        })
    );
  }

}

