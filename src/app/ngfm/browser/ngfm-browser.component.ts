import { Component, OnInit, Input, Optional, Inject, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgfmFolder, NgfmFile } from '../models/public_api';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, tap } from 'rxjs/operators';
import { NgfmService } from '../service/ngfm.service';
import { NgfmConfig } from '../config/ngfm-config';

@Component({
  selector: 'ngfm-browser',
  templateUrl: './ngfm-browser.component.html',
  styleUrls: ['./ngfm-browser.component.css']
})
export class NgfmBrowserComponent implements OnInit {
  @Input() root$: Observable<string[]>;
  @Input() path$: Observable<string[]>;
  @Input() config$: Observable<NgfmConfig>;
  @HostBinding('class.ngfm-browser') private _hostClass = true;
  folder$: Observable<NgfmFolder>;
  constructor(
    private ngfm: NgfmService
  ) { }

  ngOnInit() {
    this.folder$ = combineLatest(this.root$, this.path$)
      .pipe(
        map(([root, path]) => new NgfmFolder(root, path)),
        tap(console.log)
      );
  }

  uploadDialog(folder: NgfmFolder) {
    this.ngfm.uploadDialog(folder);
  }

}
