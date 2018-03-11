import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { Observable } from 'rxjs/Observable';
import { NgfmItem } from '../models/ngfm-item';
import { Subject } from 'rxjs/Subject';
export class NgfmConnector {
  private overlay = null;
  beforeMethod$: Subject<any> = new Subject();
  afterMethod$: Subject<any> = new Subject();
  // TODO: add a type 'NgfmFilter' or sumthin
  ls(folder: NgfmFolder, filter: any = {}): Observable<NgfmItem[]> { throw Error('You must implement all methods of NgfmConnector') }
  mkDir(folder: NgfmFolder): Observable<NgfmFolder> { throw Error('You must implement all methods of NgfmConnector') }
  rmDir(folder: NgfmFolder): Observable<NgfmFolder> { throw Error('You must implement all methods of NgfmConnector') }
  rm(file: NgfmFile): Observable<NgfmFile> { throw Error('You must implement all methods of NgfmConnector') }
  moveFiles(files: NgfmFile[], from: NgfmFolder, to: NgfmFolder): Observable<{ files: NgfmFile[], from: NgfmFolder, to: NgfmFolder }> { throw Error('You must implement all methods of NgfmConnector') }
  /**
   * 
   * @param file The NgfmFile to upload
   * @Returns Observable of progress between 0-1. Completes when done.
   */
  uploadFile(file: NgfmFile): Observable<number> { throw Error('You must implement all methods of NgfmConnector') }
  folderExists(folder: NgfmFolder): Observable<boolean> { throw Error('You must implement all methods of NgfmConnector') }
  fileExists(file: NgfmFile): Observable<boolean> { throw Error('You must implement all methods of NgfmConnector') }
  rename(item: NgfmItem, newName: string): Observable<NgfmItem> { throw Error('You must implement all methods of NgfmConnector') }
  showOverlay(b = true) {
    if (b && (!this.overlay)) {
      this.overlay = this.createOverlay();
    }
    if (!b && (this.overlay)) {
      this.removeOverlay();
    }
  }
  createOverlay() {
    const ovl = document.createElement('div');
    ovl.className = 'loading-overlay';
    setTimeout(() => {
      ovl.className = 'loading-overlay visible';
    }, 5);
    const ovlIcon = document.createElement('i');
    ovlIcon.className = 'fa fa-spin fa-spinner fa-2x';
    ovl.appendChild(ovlIcon);
    document.body.appendChild(ovl);
    return ovl;
  }
  removeOverlay() {
    this.overlay.className = 'loading-overlay';
    const ovl = this.overlay;
    setTimeout(() => {
      document.body.removeChild(ovl);
    }, 300);
    this.overlay = null;
  }
}