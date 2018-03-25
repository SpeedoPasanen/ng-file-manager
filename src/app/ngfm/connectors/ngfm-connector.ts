import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { Observable } from 'rxjs/Observable';
import { NgfmItem } from '../models/ngfm-item';
import { Subject } from 'rxjs/Subject';
export abstract class NgfmConnector {
  // TODO: add a type 'NgfmFilter' or sumthin
  abstract ls(folder: NgfmFolder, filter?: any): Observable<NgfmItem[]>
  abstract mkDir(folder: NgfmFolder): Observable<NgfmFolder>
  abstract rmDir(folder: NgfmFolder): Observable<NgfmFolder>
  abstract rm(file: NgfmFile): Observable<NgfmFile>
  abstract moveFiles(files: NgfmFile[], from: NgfmFolder, to: NgfmFolder): Observable<{ files: NgfmFile[], from: NgfmFolder, to: NgfmFolder }>
  /**
   * 
   * @param file The NgfmFile to upload
   * @Returns Observable of progress between 0-1. Completes when done.
   */
  abstract uploadFile(file: NgfmFile): Observable<number>
  abstract rename(item: NgfmItem, newName: string): Observable<void>
}