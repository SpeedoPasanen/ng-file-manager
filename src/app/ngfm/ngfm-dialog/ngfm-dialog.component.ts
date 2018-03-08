import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
@Component({
  selector: 'ngfm-dialog',
  templateUrl: './ngfm-dialog.component.html',
  styleUrls: ['./ngfm-dialog.component.css']
})
export class NgfmDialogComponent implements OnInit {
  path$: Observable<string[]>;
  root$: Observable<string[]>;
  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  ngOnInit() {
    if (!(this.dialogData.root && this.dialogData.path)) {
      throw Error('NgfmDialog: you need to pass path and root as data to mat-dialog!');
    }
    this.path$ = of(this.dialogData.path);
    this.root$ = of(this.dialogData.root);
  }

}
