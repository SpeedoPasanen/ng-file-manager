import { Injectable, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgfmDialogComponent, NgfmUploadStatus } from '../public_api';
import { NgfmFolder, NgfmFile } from '../models/public_api';
import { NgfmUploadDialogComponent } from '../upload-dialog/ngfm-upload-dialog.component';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { NGFM_CONNECTOR, NgfmConnector } from '../connectors/public_api';

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
  openDialog(root: string[], path: string[]) {
    const dlg = this.dialog.open(NgfmDialogComponent, {
      width: '95vw',
      maxWidth: '95vw',
      height: '95vh',
      maxHeight: '95vh',
      data: { root, path }
    });
    return dlg.afterClosed();
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

}
