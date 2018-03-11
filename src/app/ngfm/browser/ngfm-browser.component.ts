import { Component, OnInit, Input, Optional, Inject, HostBinding, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { of } from 'rxjs/observable/of';
import { map, tap, switchMap, startWith, take } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { NgfmConfig } from '../models/ngfm-config';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmFile } from '../models/ngfm-file';
import { NgfmService } from '../service/ngfm.service';
import { NgfmItem } from '../models/ngfm-item';
import { Subscription } from 'rxjs/Subscription';
import { NgfmDialogService } from '../dialog/ngfm-dialog.service';

@Component({
  selector: 'ngfm-browser',
  templateUrl: './ngfm-browser.component.html',
  styleUrls: ['./ngfm-browser.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgfmBrowserComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pick: 'file' | 'folder' | null;
  @Input() root$: Observable<string[]>;
  @Input() path$: Observable<string[]>;
  @Input() config$: Observable<NgfmConfig>;
  @HostBinding('class.ngfm-browser') private _hostClass = true;
  @Output() navigated: EventEmitter<NgfmFolder> = new EventEmitter();
  @Output() picked: EventEmitter<NgfmItem> = new EventEmitter();
  gridCols$: Observable<number>;
  folder$: Observable<NgfmFolder>;
  children: NgfmItem[];
  private subscriptions: Subscription[];
  selectedFiles: NgfmFile[] = [];
  @ViewChild('widthSource') widthSource: ElementRef
  constructor(
    private ngfm: NgfmService,
    private cdRef: ChangeDetectorRef,
    private dialog: NgfmDialogService
  ) { }

  ngOnInit() {
    this.rebase();
    this.gridCols$ = !window ? of(8) : fromEvent(window, 'resize').pipe(
      startWith(8),
      switchMap(() => this.getColCount()),
    );
    this.subscriptions = [
      this.ngfm.connector.afterMethod$.subscribe(data => {
        switch (data.method) {
          case 'rm': case 'rmDir':
            const child = this.children.find(c => c.hash === data.result.hash);
            this.children.splice(this.children.indexOf(child), 1);
            if (child.isFile) { this.selectedFiles.splice(this.children.indexOf(child), 1); }
            this.cdRef.markForCheck();
            break;
          case 'rename': case 'mkDir': case 'moveFiles': return this.refresh();
        }
      })
    ];
  }
  ngOnDestroy() { this.subscriptions.forEach(s => s.unsubscribe()); }
  getColCount(): Observable<number> {
    const containerWidth = this.widthSource.nativeElement.offsetWidth;
    return this.config$.pipe(
      take(1),
      map(config => {
        return Math.floor(containerWidth / config.listItemSize);
      }));
  }

  rebase() {
    this.folder$ = combineLatest(this.root$, this.path$)
      .pipe(
        map(([root, path]) => new NgfmFolder(root, path)),
        tap(this.refresh.bind(this))
      );
  }

  refresh(folder: NgfmFolder = null) {
    if (!folder) {
      this.folder$.pipe(take(1)).subscribe(folder => this.refresh(folder));
      return;
    }
    // const filter = this.pick ? { itemType: this.pick } : {}; // @Meditation: I donno if this is even a good idea. Better let user see what files are in there?
    this.ngfm.connector.ls(folder).pipe(take(1)).subscribe(items => {
      this.children = items;
      this.selectedFiles = this.selectedFiles.map(selFile => items.find(item => item.hash === selFile.hash) as NgfmFile).filter(foundFile => !!foundFile).map(selFile => { selFile.selected = true; return selFile; });
      this.cdRef.markForCheck();
    });
  }

  uploadDialog(folder: NgfmFolder) {
    this.ngfm.uploadDialog(folder).subscribe(result => this.refresh(folder));
  }
  async mkDir(folder: NgfmFolder) {
    const name = await this.dialog.openPrompt('Folder Name', '', '');
    if (!name) {
      return;
    }
    this.ngfm.mkSubDir(folder, name).subscribe(() => this.refresh(folder));
  }
  clicked(item: NgfmItem) {
    if (item.isFolder) {
      return this.navigate(item as NgfmFolder);
    }
    if (item.isFile) {
      const file = (item as NgfmFile);
      if (file.isImage) {
        this.dialog.open(file.name, `<img style="max-width:100%;height:auto" src="${file.url}"/>`);
      }
      if (file.isVideo) {
        return this.dialog.open(file.name,
          `<video width="1280" height="720" autoplay controls class="img-fluid">
          <source src="${file.url}" type="video/mp4">Selaimesi ei tue HTML5-videoita.</source>
          </video>`);
      }
      if (file.isAudio) {
        return this.dialog.open(file.name,
          `<audio src="${file.url}" preload="auto" autoplay controls></audio>`);
      }
    }
  }
  navigate(folder: NgfmFolder) {
    this.children = [];
    this.navigated.next(folder);
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('root$' in changes || 'path$' in changes) {
      this.rebase();
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
    const allFiles: NgfmFile[] = this.children.filter(item => item.isFile) as NgfmFile[];
    this.selectedFiles = this.selectedFiles.length === allFiles.length ? [] : [...allFiles as NgfmFile[]];
    allFiles.forEach(file => file.selected = this.selectedFiles.indexOf(file) > -1);
  }
  choose(item: NgfmItem, ev) {
    ev.stopPropagation();
    this.picked.emit(item);
  }
}
