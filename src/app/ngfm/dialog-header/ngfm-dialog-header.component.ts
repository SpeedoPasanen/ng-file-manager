import { Component, OnInit, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ngfm-dialog-header',
  templateUrl: './ngfm-dialog-header.component.html',
  styleUrls: ['./ngfm-dialog-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgfmDialogHeaderComponent implements OnInit {
  @Input() title = '';
  @Input() disableClose = false;
  @HostBinding('class.ngfm-dialog-header') _hostClass = true;
  constructor() { }

  ngOnInit() {
  }

}
