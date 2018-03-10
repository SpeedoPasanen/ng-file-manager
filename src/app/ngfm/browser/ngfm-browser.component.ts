import { Component, OnInit, Input, Optional, Inject, HostBinding, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgfmFolder, NgfmFile } from '../models/public_api';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, tap, switchMap, startWith, take } from 'rxjs/operators';
import { NgfmService } from '../service/ngfm.service';
import { Subject } from 'rxjs/Subject';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { NgfmConfig } from '../public_api';

@Component({
  selector: 'ngfm-browser',
  templateUrl: './ngfm-browser.component.html',
  styleUrls: ['./ngfm-browser.component.css']
})
export class NgfmBrowserComponent implements OnInit, OnChanges {
  @Input() root$: Observable<string[]>;
  @Input() path$: Observable<string[]>;
  @Input() config$: Observable<NgfmConfig>;
  @HostBinding('class.ngfm-browser') private _hostClass = true;
  @Output() navigated: EventEmitter<NgfmFolder> = new EventEmitter();
  gridCols$: Observable<number>;
  gridRowHeight = 120;
  folder$: Observable<NgfmFolder>;
  children$: Observable<{ files: NgfmFile[], folders: NgfmFolder[] }>;
  constructor(
    private ngfm: NgfmService,
    private media: ObservableMedia
  ) { }

  ngOnInit() {
    this.rebase();
    this.gridCols$ = this.media.asObservable().pipe(
      // MEH, TODO: get rid of this, calculate colCount from the container width
      startWith(),
      switchMap(() => this.getColCount()),
    );
  }
  getColCount(): Observable<number> {
    return this.config$.pipe(
      take(1),
      map(config => {
        if (this.media.isActive('xs')) { return config.xsCols; }
        if (this.media.isActive('sm')) { return config.smCols; }
        if (this.media.isActive('md')) { return config.mdCols; }
        if (this.media.isActive('lg')) { return config.lgCols; }
        return config.xlCols;
      }));
  }

  rebase() {
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
    console.log(folder);
    this.navigated.next(folder);
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('root$' in changes || 'path$' in changes) {
      this.rebase();
    }
  }
}
