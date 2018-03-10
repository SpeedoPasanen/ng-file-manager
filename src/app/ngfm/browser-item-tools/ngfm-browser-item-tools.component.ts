import { Component, OnInit, Input } from '@angular/core';
import { NgfmFile } from '../models/ngfm-file';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmConfig } from '../models/ngfm-config';

@Component({
  selector: 'ngfm-browser-item-tools',
  templateUrl: './ngfm-browser-item-tools.component.html',
  styleUrls: ['./ngfm-browser-item-tools.component.css']
})
export class NgfmBrowserItemToolsComponent implements OnInit {
  @Input() file: NgfmFile;
  @Input() folder: NgfmFolder;
  @Input() config: NgfmConfig;
  clicked(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
  }
  constructor() { }

  ngOnInit() {
  }

}
