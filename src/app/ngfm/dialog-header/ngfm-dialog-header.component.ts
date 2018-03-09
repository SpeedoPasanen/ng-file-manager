import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'ngfm-dialog-header',
  templateUrl: './ngfm-dialog-header.component.html',
  styleUrls: ['./ngfm-dialog-header.component.css']
})
export class NgfmDialogHeaderComponent implements OnInit {
  @Input() title = '';
  @HostBinding('class.ngfm-dialog-header') _hostClass = true;
  constructor() { }

  ngOnInit() {
  }

}
