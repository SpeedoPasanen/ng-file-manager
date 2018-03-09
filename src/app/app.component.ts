import { Component } from '@angular/core';
import { NgfmService } from './ngfm/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private ngfm: NgfmService
  ) {

  }
  openDialog() {
    this.ngfm.openDialog(['fooRoot'], ['fooPath']);
  }
}
