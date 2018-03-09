import { Component, OnInit, Input, Optional, Inject, HostBinding, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgfmFolder, NgfmFile } from '../models/public_api';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, tap, switchMap } from 'rxjs/operators';
import { NgfmService } from '../service/ngfm.service';
import { NgfmConfig } from '../config/ngfm-config';
import { Subject } from 'rxjs/Subject';

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
  @Output() navigated: EventEmitter<NgfmFolder> = new EventEmitter();
  folder$: Observable<NgfmFolder>;
  children$: Observable<{ files: NgfmFile[], folders: NgfmFolder[] }>;
  constructor(
    private ngfm: NgfmService
  ) { }

  ngOnInit() {
    this.folder$ = combineLatest(this.root$, this.path$)
      .pipe(
        map(([root, path]) => new NgfmFolder(root, path)),
        tap(this.refresh.bind(this))
      );
  }

  refresh(folder: NgfmFolder) {
    this.children$ = this.ngfm.connector.ls(folder);
  }

  uploadDialog(folder: NgfmFolder) {
    this.ngfm.uploadDialog(folder).subscribe(result => this.refresh(folder));
  }
  mkDir(folder: NgfmFolder) {
    const name = prompt('Gimme a name');
    if (!name) {
      return;
    }
    this.ngfm.mkSubDir(folder, name).subscribe(() => this.refresh(folder));
  }
  navigate(folder: NgfmFolder) {
    this.navigated.next(folder);
  }

}
