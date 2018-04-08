import { Component, OnInit, Inject, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { NgfmConfig } from '../models/ngfm-config';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmItem } from '../models/ngfm-item';
@Component({
  selector: 'ngfm-browser-dialog',
  templateUrl: './ngfm-browser-dialog.component.html',
  styleUrls: ['./ngfm-browser-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgfmBrowserDialogComponent implements OnInit {
  @HostBinding('class.ngfm-browser-dialog') private _hostClass = true;
  folder: NgfmFolder;
  title = 'File Browser';
  config$: Observable<string[]>;
  pick: 'file' | 'folder' | null;
  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<NgfmBrowserDialogComponent>
  ) { }

  ngOnInit() {
    if (!(this.dialogData.root && this.dialogData.path)) {
      throw Error('NgfmDialog: you need to pass path and root as data to mat-dialog!');
    }
    this.navigated(new NgfmFolder(this.dialogData.root, this.dialogData.path));
    this.config$ = of(this.dialogData.config || new NgfmConfig());
    this.title = this.dialogData.title || this.title;
    this.pick = this.dialogData.pick || null;
  }
  navigated(folder: NgfmFolder) {
    this.folder = folder;
  }
  picked(item: NgfmItem) {
    this.dialogRef.close(item);
  }
}
