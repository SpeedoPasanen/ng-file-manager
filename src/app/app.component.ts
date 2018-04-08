import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgfmApi } from './ngfm/connectors/ngfm-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  pickResult: any;
  dialogCall: string = null;
  constructor(
    private ngfm: NgfmApi
  ) {

  }
  openDialog(pick: 'file' | 'folder' | null) {
    this.pickResult = null;
    this.ngfm.openDialog(['private', '1337'], [], { pick }).subscribe(picked => this.pickResult = picked);
    this.dialogCall = `this.ngfm.openDialog(
      ['private', '1337'],
      [],
      { pick: ${pick ? "'" + pick + "'" : 'null'} }
    ).subscribe(picked => this.pickResult = picked);`;
  }
}
