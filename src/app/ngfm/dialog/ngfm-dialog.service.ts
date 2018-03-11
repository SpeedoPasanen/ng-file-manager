import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material';

import { NgfmDialogComponent } from './ngfm-dialog.component';

@Injectable()
export class NgfmDialogService {
  public okCancel: DialogButtonConfig[] = [
    { text: 'OK', value: true, color: 'primary' },
    { text: 'Peruuta', value: false, color: 'default' }
  ];
  private refs: MatDialogRef<any>[] = [];
  public noButtons: DialogButtonConfig[] = [];
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) { }
  public open(title: string, html: string = '', buttons: DialogButtonConfig[] = null, otherData: any = {}): Promise<any> {
    const dialogRef = this.dialog.open(NgfmDialogComponent, { data: { title, html, buttons, ...otherData } });
    this.refs.push(dialogRef);
    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
        this.refs.splice(this.refs.indexOf(dialogRef), 1);
      });
    });
  }
  public openPrompt(title: string = '', html: string = '', defaultValue: string = ''): Promise<string | false | null> {
    return this.open(title, html, this.okCancel, { isPrompt: true, defaultValue });
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
}

export interface DialogButtonConfig {
  text: string;
  color?: string;
  value?: any;
}