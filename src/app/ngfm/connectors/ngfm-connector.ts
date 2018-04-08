import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { Observable } from 'rxjs/Observable';
import { NgfmItem } from '../models/ngfm-item';
import { Subject } from 'rxjs/Subject';
import { NgfmProgress } from './ngfm-progress';
export abstract class NgfmConnector {
  // TODO: add a type 'NgfmFilter' or sumthin
  abstract ls(folder: NgfmFolder, filters?: any): NgfmProgress
  abstract mkDir(folder: NgfmFolder): NgfmProgress
  abstract rmDir(folder: NgfmFolder): NgfmProgress
  abstract rm(file: NgfmFile): NgfmProgress
  abstract moveFiles(files: NgfmFile[], from: NgfmFolder, to: NgfmFolder): NgfmProgress
  /**
   * 
   * @param file The NgfmFile to upload
   * @Returns Observable of progress between 0-1. Completes when done.
   */
  abstract uploadFile(file: NgfmFile): NgfmProgress
  abstract rename(item: NgfmItem, newName: string): NgfmProgress
}