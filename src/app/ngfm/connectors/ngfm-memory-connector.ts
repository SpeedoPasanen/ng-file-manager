import { Injectable } from '@angular/core';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { NgfmConnector } from './ngfm-connector';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { of } from 'rxjs/observable/of';
import { map, switchMap, takeWhile, tap, last } from 'rxjs/operators';
import * as _ from 'lodash';
import { NgfmItem } from '../models/ngfm-item';
import { NgfmConnectorHooks } from './ngfm-connector-hooks';

@Injectable()
@NgfmConnectorHooks()
export class NgfmMemoryConnector extends NgfmConnector {
  private tree: any = {
    'public': { files: this.getDemoFiles(1, ['public']) },
    'public/Public Folder 1': { files: this.getDemoFiles(50, ['public'], ['Public Folder 1']) },
    'private/1337': { files: this.getDemoFiles(10, ['private', '1337'], []) },
    'private/1337/Private Folder 1': { files: this.getDemoFiles(1, ['private', '1337'], ['Private Folder 1']) },
  };
  private getDemoFiles(amount: number, root: string[], path: string[] = []) {
    const files = [];
    while (amount > files.length) {
      const w = Math.round(Math.random() * 800 + 200);
      const h = Math.round(Math.random() * 800 + 200);
      files.push(new NgfmFile(new NgfmFolder(root, path), {
        name: `${w}x${h} demo file.jpg`, url: `https://placehold.it/${w}x${h}`,
        size: 1024 + Math.round(Math.random() * 20000000),
        type: 'image/jpeg'
      }));
    }
    return files;
  }
  moveFiles(files: NgfmFile[], from: NgfmFolder, to: NgfmFolder): Observable<{ files: NgfmFile[], from: NgfmFolder, to: NgfmFolder }> {
    const fromNodee = this.getNode(from);
    const toNode = this.getNode(to);
    fromNodee.files = fromNodee.files.filter(nodeFile => !files.find(file => nodeFile.hash === file.hash));
    toNode.files = [...toNode.files, ...files];
    return timer(500).pipe(map(() => { return { files, from, to }; }));
  }
  rename(item: NgfmItem, newName: string): Observable<NgfmItem> {
    if (item.isFile) {
      const file = item as NgfmFile;
      const node = this.getNode(file.folder);
      node.files.find(f => f.hash === file.hash).name = file.name = newName;
      return timer(500).pipe(map(() => item));
    }
    if (item.isFolder) {
      const folder = item as NgfmFolder;
      const newFolder = new NgfmFolder(folder.root, [...folder.parent.path, newName]);
      const node = this.getNode(folder);
      const newNode = this.getNode(newFolder);
      newNode.files = node.files;
      delete this.tree[folder.toString()];
      return timer(500).pipe(map(() => item));
    }
  }
  private getNode(folder) {
    return this.tree[folder.toString()] = this.tree[folder.toString()] || { files: [] };
  }
  private getChildren(path: string) {
    const childExpr = new RegExp(`${path}/.+`);
    const childNames = Object.keys(this.tree)
      .map(key => (!path ? '/' : '') + key)
      .filter(key => childExpr.test(key))
      .map(key => key.replace(`${path}/`, '').replace(/\/.*/, ''));
    return _.uniq(childNames);
  }

  folderExists(folder: NgfmFolder): Observable<boolean> {
    return timer(100).pipe(map(() => !!this.tree[folder.toString()]));
  }
  fileExists(file: NgfmFile): Observable<boolean> {
    return this.folderExists(file.folder).pipe(
      map(folderExists => folderExists && (!!this.tree[file.folder.toString()].files.find(f => f.name === file.name)))
    );
  }
  ls(folder: NgfmFolder, filter: any = {}): Observable<NgfmItem[]> {
    return timer(300)
      .pipe(
        map(foo => [
          ...(filter.itemType === 'file' ? [] : this.getChildren(folder.toString()).map(childName => new NgfmFolder(folder.root, [...folder.path, childName]))),
          ...(filter.itemType === 'folder' ? [] : this.getNode(folder).files.map(item => Object.assign(new NgfmFile(folder, item), item)))
        ])
      );
  }
  mkDir(folder: NgfmFolder): Observable<NgfmFolder> {
    return timer(100).pipe(map(foo => this.getNode(folder)));
  }
  rmDir(folder: NgfmFolder): Observable<NgfmFolder> {
    delete this.tree[folder.toString()];
    return timer(100).pipe(map(foo => folder));
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
    const observable = this.mkDir(file.folder).pipe(
      switchMap(() => {
        this.getNode(file.folder).files = _.uniqBy([...this.getNode(file.folder).files, file], f => f.name)
        return file.readDataURL().pipe(map((dataUrl) => {
          file.url = dataUrl;
          return file;
        }));
      }),
      switchMap(() => timer(0, 20)),
      map(val => Math.min(1, val / 30)),
      takeWhile(val => val < 1)
    );
    return observable;
  }

}

