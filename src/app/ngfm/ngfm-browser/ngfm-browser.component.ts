import { Component, OnInit, Input, Optional, Inject, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgfmConfig } from '../ngfm-config/ngfm-config';

@Component({
  selector: 'ngfm-browser',
  templateUrl: './ngfm-browser.component.html',
  styleUrls: ['./ngfm-browser.component.css']
})
export class NgfmBrowserComponent implements OnInit {
  @Input() root$: Observable<string[]>;
  @Input() path$: Observable<string[]>;
  @Input() config$: Observable<NgfmConfig>;
  @HostBinding('class.ngfm-browser') private _hostClass: boolean = true;
  constructor(
  ) { }

  ngOnInit() {
  }

}