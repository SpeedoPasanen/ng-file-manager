import { Injectable, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgfmUploadDialogComponent } from '../upload-dialog/ngfm-upload-dialog.component';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { NGFM_CONNECTOR } from '../connectors/constants';
import { NgfmConnector } from '../connectors/ngfm-connector';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmDialogComponent } from '../browser-dialog/ngfm-dialog.component';

@Injectable()
export class NgfmService {

  constructor(
    private dialog: MatDialog,
    @Inject(NGFM_CONNECTOR) public connector: NgfmConnector
  ) { }

  /**
   *
   * @param root
   * @param path
   */
  openDialog(root: string[], path: string[], dialogData: any = {}) {
    const dlg = this.dialog.open(NgfmDialogComponent, {
      width: '95vw',
      maxWidth: '95vw',
      height: '95vh',
      maxHeight: '95vh',
      data: Object.assign({ root, path }, dialogData)
    });
    return dlg.afterClosed();
  }

  pickFolder(root: string[], path: string[]) {
    return this.openDialog(root, path, { pick: 'folder' });
  }

  /**
   *
   * @param folder Path to upload into
   */
  uploadDialog(folder: NgfmFolder): Observable<any> {
    const dlg = this.dialog.open(NgfmUploadDialogComponent, {
      minWidth: '60vw',
      data: { folder }
    });
    return dlg.afterClosed();
  }

  mkSubDir(folder: NgfmFolder, dirName: string) {
    return this.connector.mkDir(new NgfmFolder(folder.root, [...folder.path, dirName]));
  }

}
