import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgfmDialogComponent } from '../public_api';
import { NgfmFolder, NgfmFile } from '../models/public_api';
import { NgfmUploadDialogComponent } from '../upload-dialog/ngfm-upload-dialog.component';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NgfmService {

  constructor(
    private dialog: MatDialog
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
  uploadDialog(folder: NgfmFolder): Observable<NgfmFile[] | null> {
    const dlg = this.dialog.open(NgfmUploadDialogComponent, {
      minWidth: '60vw',
      data: { folder }
    });
    return dlg.afterClosed();
  }
}
