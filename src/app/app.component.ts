import { Component } from '@angular/core';
import { NgfmApi } from './ngfm/connectors/ngfm-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private ngfm: NgfmApi
  ) {

  }
  openDialog() {
    this.ngfm.openDialog([], []);
  }
}
