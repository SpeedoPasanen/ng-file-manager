import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
@Component({
  selector: 'ngfm-upload-dialog',
  templateUrl: './ngfm-upload-dialog.component.html',
  styleUrls: ['./ngfm-upload-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgfmUploadDialogComponent implements OnInit {
  folder: NgfmFolder;
  files: NgfmFile[] = [];
  isOver = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any
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
}
