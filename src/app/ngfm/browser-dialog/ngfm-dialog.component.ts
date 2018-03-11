import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { NgfmConfig } from '../models/ngfm-config';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmItem } from '../models/ngfm-item';
@Component({
  selector: 'ngfm-dialog',
  templateUrl: './ngfm-dialog.component.html',
  styleUrls: ['./ngfm-dialog.component.css']
})
export class NgfmDialogComponent implements OnInit {
  title = 'File Browser';
  path$: Observable<string[]>;
  root$: Observable<string[]>;
  config$: Observable<string[]>;
  pick: 'file' | 'folder' | null;
  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private dialogRef: MatDialogRef<NgfmDialogComponent>
  ) { }

  ngOnInit() {
    if (!(this.dialogData.root && this.dialogData.path)) {
      throw Error('NgfmDialog: you need to pass path and root as data to mat-dialog!');
    }
    this.path$ = of(this.dialogData.path);
    this.root$ = of(this.dialogData.root);
    this.config$ = of(this.dialogData.config || new NgfmConfig());
    this.title = this.dialogData.title || this.title;
    this.pick = this.dialogData.pick || null;
  }
  navigated(folder: NgfmFolder) {
    this.path$ = of(folder.path);
    this.root$ = of(folder.root);
  }
  picked(item: NgfmItem) {
    this.dialogRef.close(item);
  }
}
