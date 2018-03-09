import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { Observable } from 'rxjs/Observable';
export abstract class NgfmConnector {
  abstract ls(folder: NgfmFolder): Observable<{ files: NgfmFile[], folders: NgfmFolder[] }>
  abstract mkDir(folder: NgfmFolder): Observable<NgfmFolder>
  abstract rmDir(folder: NgfmFolder): Observable<NgfmFolder>
  abstract rm(file: NgfmFile): Observable<NgfmFile>
  abstract uploadFile(file: NgfmFile): Observable<number>
  abstract folderExists(folder: NgfmFolder): Observable<boolean>
  abstract fileExists(file: NgfmFile): Observable<boolean>
}