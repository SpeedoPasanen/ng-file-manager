import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material';

import { NgfmDialogComponent } from './ngfm-dialog.component';
import { NgfmFolder } from '../models/ngfm-folder';
import { Observable } from 'rxjs/Observable';
import { NgfmUploadDialogComponent } from '../upload-dialog/ngfm-upload-dialog.component';

@Injectable()
export class NgfmDialogService {
  public okCancel: DialogButtonConfig[] = [
    { text: 'OK', value: true, color: 'primary' },
    { text: 'Cancel', value: false, color: 'default' }
  ];
  private refs: MatDialogRef<any>[] = [];
  public noButtons: DialogButtonConfig[] = [];
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) { }
  public open(title: string, html: string = '', buttons: DialogButtonConfig[] = null, otherData: any = {}): Promise<any> {
    const dialogRef = this.dialog.open(NgfmDialogComponent, {
      data: { title, html, buttons, ...otherData },
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
    this.refs.push(dialogRef);
    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
        this.refs.splice(this.refs.indexOf(dialogRef), 1);
      });
    });
  }
  public openPrompt(title: string = '', html: string = '', defaultValue: string = ''): Promise<string | false | null> {
    return this.open(title, html, this.okCancel, { isPrompt: true, defaultValue, autoFocus: true });
  }
  public openOkCancel(title: string, html: string = '') {
    return this.open(title, html, this.okCancel);
  }
  public snackbar(message: string, action?: any, config?: MatSnackBarConfig): MatSnackBarRef<any> {
    return this.snack.open(message, action, config);
  }
  public closeAll() {
    this.refs.map(ref => { ref.close(); });
  }
  public blockUi(title: string, html: string = '') {
    return this.open('<i class="fa fa-spin fa-spinner"></i> ' + title, html, this.noButtons);
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

export interface DialogButtonConfig {
  text: string;
  color?: string;
  value?: any;
}