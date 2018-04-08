import { Component, OnInit, Input, Optional, Inject, HostBinding, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { of } from 'rxjs/observable/of';
import { map, tap, switchMap, startWith, take, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { NgfmConfig } from '../models/ngfm-config';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { NgfmItem } from '../models/ngfm-item';
import { NgfmDialogService } from '../dialog/ngfm-dialog.service';
import { NgfmApi } from '../connectors/ngfm-api';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ngfm-browser',
  templateUrl: './ngfm-browser.component.html',
  styleUrls: ['./ngfm-browser.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgfmBrowserComponent implements OnInit, OnChanges, OnDestroy {
  @HostBinding('class.ngfm-browser') private _hostClass = true;
  @Input() pick: 'file' | 'folder' | null;
  @Input() config$: Observable<NgfmConfig>;
  @Output() navigated: EventEmitter<NgfmFolder> = new EventEmitter();
  @Output() picked: EventEmitter<NgfmItem> = new EventEmitter();
  @Input() folder: NgfmFolder;
  gridCols$: Observable<number>;
  children$: BehaviorSubject<NgfmItem[]>;
  selectedFiles: NgfmFile[] = [];
  @ViewChild('widthSource') widthSource: ElementRef
  private subscriptions: Subscription[];
  constructor(
    private ngfm: NgfmApi,
    private cdRef: ChangeDetectorRef,
    private dialog: NgfmDialogService
  ) { }

  ngOnInit() {
    this.subscriptions = [this.ngfm.navigate.subscribe(this.navigate.bind(this))];
    this.gridCols$ = !window ? of(8) : fromEvent(window, 'resize').pipe(
      startWith(8),
      switchMap(() => this.getColCount()),
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  getColCount(): Observable<number> {
    const containerWidth = this.widthSource.nativeElement.offsetWidth;
    return this.config$.pipe(
      take(1),
      map(config => {
        this.ngfm.config = config; // TODO: Ugly ass code, just needed to get config there quick, fix later! xD
        return Math.floor(containerWidth / config.listItemSize);
      }));
  }


  refresh(folder: NgfmFolder = null) {
    // const filter = this.pick ? { itemType: this.pick } : {}; // @Meditation: I donno if this is even a good idea. Better let user see what files are in there?
    this.children$ = this.ngfm.ls(folder).pipe(
      tap(items => {
        // this.children = items;
        this.selectedFiles = this.selectedFiles.map(selFile => items.find(item => item.id === selFile.id) as NgfmFile).filter(foundFile => !!foundFile).map(selFile => { selFile.selected = true; return selFile; });
        this.cdRef.markForCheck();
      })) as BehaviorSubject<NgfmItem[]>;
  }

  uploadDialog(folder: NgfmFolder) {
    this.dialog.uploadDialog(folder).subscribe();
  }
  mkDir(folder: NgfmFolder) {
    this.dialog.openPrompt('Folder Name', '', '').then(folderName => {
      if (!folderName) {
        return;
      }
      this.ngfm.mkSubDir(folder, folderName).subscribe();
    });
  }
  trackByFn(idx: number, item: NgfmItem) {
    return item.id;
  }
  clicked(item: NgfmItem) {
    if (item.isFolder) {
      return this.navigate(item as NgfmFolder);
    }
    if (item.isFile) {
      const file = (item as NgfmFile);
      if (file.preview) {
        return this.dialog.open(file.name, '', null, { file, config$: this.config$ });
      }
      if (file.isVideo) {
        return this.dialog.open(file.name,
          `<video width="1280" height="720" autoplay controls class="img-fluid">
          <source src="${file.url}" type="video/mp4">Your browser does not support HTML5 video.</source>
          </video>`);
      }
      if (file.isAudio) {
        return this.dialog.open(file.name,
          `<audio src="${file.url}" preload="auto" autoplay controls></audio>`);
      }
      this.ngfm.download(item as NgfmFile);
    }
  }
  navigate(folder: NgfmFolder) {
    // this.children = [];
    this.navigated.next(folder);
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('folder' in changes) {
      this.refresh(this.folder);
    }
  }
  selectionChange(file: NgfmFile) {
    const idx = this.selectedFiles.indexOf(file);
    if (idx > -1) {
      this.selectedFiles.splice(idx, 1);
    } else {
      this.selectedFiles.push(file);
    }
    this.selectedFiles = [...this.selectedFiles];
  }
  selectAll() {
    this.children$.pipe(take(1)).subscribe(children => {
      const allFiles: NgfmFile[] = children.filter(item => item.isFile) as NgfmFile[];
      this.selectedFiles = this.selectedFiles.length === allFiles.length ? [] : [...allFiles as NgfmFile[]];
      allFiles.forEach(file => file.selected = this.selectedFiles.indexOf(file) > -1);
    });
  }
  choose(item: NgfmItem, ev) {
    ev.stopPropagation();
    this.picked.emit(item);
  }
}
