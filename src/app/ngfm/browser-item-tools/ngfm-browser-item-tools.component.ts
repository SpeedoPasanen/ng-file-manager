import { Component, OnInit, Input } from '@angular/core';
import { NgfmFile } from '../models/ngfm-file';
import { NgfmFolder } from '../public_api';

@Component({
  selector: 'ngfm-browser-item-tools',
  templateUrl: './ngfm-browser-item-tools.component.html',
  styleUrls: ['./ngfm-browser-item-tools.component.css']
})
export class NgfmBrowserItemToolsComponent implements OnInit {
  @Input() file: NgfmFile;
  @Input() folder: NgfmFolder;
  constructor() { }

  ngOnInit() {
  }

}
