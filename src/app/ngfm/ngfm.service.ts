import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgfmDialogComponent } from './ngfm-dialog/ngfm-dialog.component';

@Injectable()
export class NgfmService {

  constructor(
    private dialog: MatDialog
  ) { }
  openDialog(root: string[], path: string[]) {
    const dlg = this.dialog.open(NgfmDialogComponent, {
      width: '95vw',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: { root, path }
    });
    return dlg.afterClosed();
  }
}
