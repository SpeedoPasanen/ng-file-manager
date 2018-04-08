import { Component, OnInit, Inject, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { take, tap } from 'rxjs/operators';
import { concat } from 'rxjs/observable/concat';
import { NgfmConnector } from '../connectors/ngfm-connector';
import { NgfmUploadStatus } from '../connectors/ngfm-upload-status';
import { NGFM_CONNECTOR } from '../connectors/constants';
import { NgfmApi } from '../connectors/ngfm-api';
@Component({
  selector: 'ngfm-upload-dialog',
  templateUrl: './ngfm-upload-dialog.component.html',
  styleUrls: ['./ngfm-upload-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgfmUploadDialogComponent implements OnInit {
  @HostBinding('class.ngfm-upload-dialog') private _hostClass = true;
  folder: NgfmFolder;
  files: NgfmFile[] = [];
  isOver = false;
  status: NgfmUploadStatus;
  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private ngfm: NgfmApi,
    private dialogRef: MatDialogRef<NgfmUploadDialogComponent>
  ) { }

  ngOnInit() {
    this.folder = this.dialogData.folder;
  }

  fileChange(e, ) {
    this.addFiles(this.arrayFrom(e.target.files).map(f => new NgfmFile(this.folder, f)));
  }
  dropped(ev) {
    this.isOver = false;
    ev.preventDefault();
    const files = !!ev.dataTransfer.items ? this.arrayFrom(ev.dataTransfer.items)
      .filter(item => item.kind === 'file')
      .map(item => new NgfmFile(this.folder, item.getAsFile()))
      : ev.dataTransfer.files || [];
    this.addFiles(files);
    this.removeDragData(ev);
  }
  removeDragData(ev) {
    if (ev.dataTransfer.items) {
      ev.dataTransfer.items.clear();
    } else {
      ev.dataTransfer.clearData();
    }
  }
  addFiles(files: NgfmFile[]) {
    this.files = _.uniqBy([...this.files, ...files], f => f.name);
  }
  dragOver(ev) {
    this.isOver = true;
    ev.preventDefault();
  }
  dragLeave(ev) {
    this.isOver = false;
    ev.preventDefault();
  }
  arrayFrom(items) {
    const a = [];
    for (let i = 0; i < items.length; i++) { a.push(items[i]); }
    return a;
  }
  trackByFn(idx, item) {
    return item.name;
  }
  upload() {
    this.files = this.files.filter(f => f.isValid);
    if (!this.files.length) {
      return;
    }
    this.dialogRef.disableClose = true;
    this.status = new NgfmUploadStatus(this.files);
    concat(...this.files.map(
      file => this.ngfm.uploadFile(file).progress.pipe(
        tap(progress => {
          this.status.currentProgress$.next(progress);
        }, (err) => {
          this.status.fileDone(file);
        }, () => {
          this.status.fileDone(file);
        })
      )
    )).subscribe(() => { }, err => {

    }, () => {
      this.ngfm.ls(this.folder);
      this.dialogRef.close(this.files);
    });
  }
}
