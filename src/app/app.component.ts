import { Component } from '@angular/core';
import { NgfmService } from './ngfm/service/ngfm.service';

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
    this.ngfm.openDialog([], []);
  }
}
