import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { Observable } from 'rxjs/Observable';
export abstract class NgfmConnector {
  abstract ls(folder: NgfmFolder): Observable<{ files: NgfmFile[], folders: NgfmFolder[] }>
  abstract mkDir(folder: NgfmFolder): Observable<NgfmFolder>
  abstract rmDir(folder: NgfmFolder): Observable<NgfmFolder>
  abstract rm(file: NgfmFile): Observable<NgfmFile>
  /**
   * 
   * @param file The NgfmFile to upload
   * @Returns Observable of the progress between 0-1. Completes when it's done.
   */
  abstract uploadFile(file: NgfmFile): Observable<number>
  abstract folderExists(folder: NgfmFolder): Observable<boolean>
  abstract fileExists(file: NgfmFile): Observable<boolean>
}