import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { of } from 'rxjs/observable/of';
import { map, switchMap, takeWhile, tap, last } from 'rxjs/operators';
import * as _ from 'lodash';
import { NgfmConnector } from '../ngfm-connector';
import { NgfmFile } from '../../models/ngfm-file';
import { NgfmFolder } from '../../models/ngfm-folder';
import { NgfmItem } from '../../models/ngfm-item';

@Injectable()
export class NgfmMemoryConnector implements NgfmConnector {
  private tree: any = {
    'public': { files: this.getDemoFiles(1, ['public']) },
    'public/Public Folder 1': { files: this.getDemoFiles(50, ['public'], ['Public Folder 1']) },
    'private/1337': { files: this.getDemoFiles(15, ['private', '1337'], []) },
    'private/1337/Private Folder 1': { files: this.getDemoFiles(1, ['private', '1337'], ['Private Folder 1']) },
  };
  private getDemoFiles(amount: number, root: string[], path: string[] = []) {
    const files = [];
    const urls = [
      'https://photos-2.dropbox.com/t/2/AACGkpOf7d611n6FvDoQfL74MZNPoOWnKvxnZfsEL21t4g/12/70590446/jpeg/32x32/3/1521406800/0/2/IMG_9065.JPG/EPGE9DYYh9cCIAIoAg/FWkF2oTzDEB4YGaV9Icg84Yx9VLN7tPkJz34jN43mlE%2CCBrCsE9iiV7uVoHyB9pcfBT1NlKqRT0-_zxA7Q5XaSw%2C-BuF5-5a_P41iBWu_fFRZ2pJxI4hukCN_yTeH9qDUvA%2C-_yABV0wOCQE9Sa_h-3MwG8ARWFgVgeONlxtHrghTPA?dl=0&size=1600x1200&size_mode=3',
      'https://photos-1.dropbox.com/t/2/AAAzWfKeporNm93TZB-ROj1B5udQ4zyyUKBU4y_DDCQv-A/12/70590446/jpeg/32x32/3/1521406800/0/2/IMG_8901.JPG/EPGE9DYYh9cCIAIoAg/a2oUjlP9akrHnA7_7JAo6A8A1McRyo3UFYGrfJDAnC4%2Cown3Qj1Dr3sYERnLfHqyQgdIkthCvL_sLmyIgifl7z0%2CpK4CoIpWUcYZMljWItHBi8L0dxsz9G1YZEQBhrKbNs8%2C00zSRwoFFAkRqMBwSsQTEp32a6H3EwHTlR0VOBG17xw?dl=0&size=1600x1200&size_mode=3',
      'https://photos-4.dropbox.com/t/2/AACEDWf0DIXU5YeUHTXjJbpqJv6Aq9CUG5oTaiCfib0_-Q/12/70590446/jpeg/32x32/3/1521406800/0/2/IMG_8936.JPG/EPGE9DYYh9cCIAIoAg/tjY3YHj2X4YK0XeE6DSI-7uleFlRmbMlDvp85-oMWcs%2CkhWvAzn5yuHc1MOnOGBTWUSBmCauxm5wSdmXJOVSv2o%2CuBJXY9uhR2Dbv6kz2jNJRmEHQqT-gqGwrr0vfQihPqs%2CBfKIqqE4nX-RouRApPXGdiWEIHKQ1N1Vtu17NPnBcp8?dl=0&size=1600x1200&size_mode=3'
    ]
    while (amount > files.length) {
      const w = Math.round(Math.random() * 800 + 200);
      const h = Math.round(Math.random() * 800 + 200);
      const fakePdf = Math.random() > 0.5;
      const url = Math.random() > 0.1 ? urls[Math.floor(Math.random() * urls.length)] : `https://placehold.it/${w}x${h}`;
      files.push(new NgfmFile(new NgfmFolder(root, path), {
        name: fakePdf ? 'Fake PDF with a preview.pdf' : `${w}x${h} demo file.jpg`,
        url,
        preview: url,
        size: 1024 + Math.round(Math.random() * 20000000),
        type: fakePdf ? 'application/pdf' : 'image/jpeg'
      }));
    }
    return files;
  }
  moveFiles(files: NgfmFile[], from: NgfmFolder, to: NgfmFolder): Observable<{ files: NgfmFile[], from: NgfmFolder, to: NgfmFolder }> {
    const fromNode = this.getNode(from);
    const toNode = this.getNode(to);
    fromNode.files = fromNode.files.filter(nodeFile => !files.find(file => nodeFile.hash === file.hash));
    toNode.files = [...toNode.files, ...files];
    return timer(700).pipe(map(() => { return { files, from, to }; }));
  }
  rename(item: NgfmItem, newName: string): Observable<NgfmItem> {
    if (item.isFile) {
      const file = item as NgfmFile;
      const node = this.getNode(file.folder);
      (node.files.find(f => f.hash === file.hash) || {}).name = file.name = newName;
      return timer(800).pipe(map(() => item));
    }
    const folder = item as NgfmFolder;
    const newFolder = new NgfmFolder(folder.root, [...folder.parent.path, newName]);
    const node = this.getNode(folder);
    const newNode = this.getNode(newFolder);
    newNode.files = node.files;
    delete this.tree[folder.toString()];
    return timer(800).pipe(map(() => item));
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
    console.log('connector.ls');
    return timer(400)
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
    const treeFile = files.find(f => f.hash === file.hash);
    files.splice(files.indexOf(treeFile), 1);
    return timer(100).pipe(map(foo => treeFile));
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

