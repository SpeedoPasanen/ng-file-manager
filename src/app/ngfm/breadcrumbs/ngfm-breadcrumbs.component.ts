import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, HostBinding } from '@angular/core';
import { NgfmFolder } from '../models/ngfm-folder';

@Component({
  selector: 'ngfm-breadcrumbs',
  templateUrl: './ngfm-breadcrumbs.component.html',
  styleUrls: ['./ngfm-breadcrumbs.component.css']
})
export class NgfmBreadcrumbsComponent implements OnInit, OnChanges {
  @HostBinding('class.ngfm-breadcrumbs') private _hostClass = true;
  @Input() folder: NgfmFolder;
  @Output() navigated: EventEmitter<NgfmFolder> = new EventEmitter();
  crumbs: NgfmFolder[];
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('folder' in changes) {
      this.crumbs = [];
      let folder = this.folder;
      while (folder.parent) {
        this.crumbs = [folder.parent, ...this.crumbs];
        folder = folder.parent;
      }
    }
  }
  navigate(folder: NgfmFolder) {
    this.navigated.next(folder);
  }

}
