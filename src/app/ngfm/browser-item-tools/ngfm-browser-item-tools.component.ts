import { Component, OnInit, Input, HostBinding, HostListener, Inject, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { NgfmFile } from '../models/ngfm-file';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmConfig } from '../models/ngfm-config';
import { NgfmConnector } from '../connectors/ngfm-connector';
import { NGFM_CONNECTOR } from '../connectors/constants';
import { NgfmItem } from '../models/ngfm-item';
import { NgfmDialogService } from '../dialog/ngfm-dialog.service';
import { NgfmApi } from '../connectors/ngfm-api';

@Component({
  selector: 'ngfm-browser-item-tools',
  templateUrl: './ngfm-browser-item-tools.component.html',
  styleUrls: ['./ngfm-browser-item-tools.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgfmBrowserItemToolsComponent implements OnInit, OnChanges {
  @Input() items: NgfmItem[];
  @Input() isFile = false;
  @Input() text = '';
  @Input() config: NgfmConfig;
  menuItems: any[] = [];
  @HostBinding('class.ngfm-browser-item-tools') private _hostClass = true;
  @Output() selectionChange: EventEmitter<NgfmItem> = new EventEmitter();
  @Output() movedOrDeleted: EventEmitter<any> = new EventEmitter();
  @HostListener('click', ['$event'])
  clicked(ev) {
    ev.stopPropagation();
    ev.stopImmediatePropagation();
  }
  constructor(
    public ngfm: NgfmApi,
    private dialog: NgfmDialogService
  ) { }
  ngOnInit() {
    this.buildMenu();
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('items' in changes) {
      this.buildMenu();
    }
  }
  buildMenu() {
    /**
     *     
     createFile?= true;
    editFile?= true;
    removeFile?= true;
    createFolder?= true;
    editFolder?= true;
    removeFolder?= true;
     */
    const icons = {
      rename: 'pencil',
      move: 'arrows',
      delete: 'ban',
      download: 'download'
    };
    this.menuItems = (this.isFile ?
      [
        {
          icon: icons.download,
          isMulti: false,
          perms: null,
          text: this.config.messages.DOWNLOAD,
          action: () => this.ngfm.download(this.items[0] as NgfmFile)
        },
        {
          icon: icons.rename,
          isMulti: false,
          perms: 'editFile',
          text: this.config.messages.RENAME,
          action: () => this.rename(this.items[0])
        },
        {
          icon: icons.move,
          isMulti: true,
          perms: 'editFile',
          text: this.config.messages.MOVE,
          action: () => this.moveFile(this.items as NgfmFile[])
        },
        {
          icon: icons.delete,
          isMulti: true,
          perms: 'removeFile',
          text: this.config.messages.DELETE,
          action: () => this.rmFiles(this.items as NgfmFile[])
        },
      ] :
      [
        {
          icon: icons.move,
          isMulti: false,
          perms: 'editFolder',
          text: this.config.messages.RENAME,
          action: () => this.rename(this.items[0])
        },
        {
          icon: icons.delete,
          isMulti: true,
          perms: 'removeFolder',
          text: this.config.messages.DELETE,
          action: () => this.rmDirs(this.items as NgfmFolder[])
        },
      ]).filter(menuItem => {
        return this.items.length && ((!menuItem.perms) || this.config.perms[menuItem.perms]) && (menuItem.isMulti || this.items.length === 1);
      });
  }
  // TODO: move all actions to the service
  async rename(item: NgfmItem) {
    const newName = await this.dialog.openPrompt(this.config.messages.RENAME, '', item.isFile ? item.name.replace(/\.[^\.]*$/, '') : item.name);
    if (newName) {
      this.ngfm.rename(item, newName + (item.isFile ? '.' + (item as NgfmFile).extension : '')).subscribe();
    }
  }
  rmFiles(files: NgfmFile[]) {
    this.dialog.openOkCancel(this.config.messages.ARE_YOU_SURE).then(confirmed =>
      confirmed && this.ngfm.rmFiles(files).subscribe(() => this.movedOrDeleted.next(true))
    );

  }
  rmDirs(dirs: NgfmFolder[]) {
    this.dialog.openOkCancel(this.config.messages.ARE_YOU_SURE).then(confirmed =>
      confirmed && this.ngfm.rmDirs(this.items as NgfmFolder[]).subscribe()
    );
  }
  moveFile(files: NgfmFile[]) {
    const from = files[0].folder;
    this.ngfm.pickFolder(from.root, from.path).subscribe((to: NgfmFolder) => {
      if (to) {
        this.ngfm.moveFiles(files, from, to).subscribe(() => {
          this.movedOrDeleted.next(true);
        });
      }
    });
  }

}
