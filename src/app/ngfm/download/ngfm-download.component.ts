import { Component, OnInit, Inject, ChangeDetectionStrategy, HostBinding } from '@angular/core';

import * as dlJs from 'downloadjs';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { map, last } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
const downloadJs = dlJs;
@Component({
  selector: 'ngfm-download',
  templateUrl: './ngfm-download.component.html',
  styleUrls: ['./ngfm-download.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgfmDownloadComponent implements OnInit {
  @HostBinding('class.ngfm-download-component') private _hostClass = true;
  progress$: BehaviorSubject<number> = new BehaviorSubject(0);
  constructor(
    private http: HttpClient,
    private ref: MatDialogRef<NgfmDownloadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    const req = new HttpRequest('GET', this.data.file.url, { responseType: 'blob', reportProgress: true });
    this.http.request(req).subscribe(evt => {
      switch (evt.type) {
        case HttpEventType.DownloadProgress:
          this.progress$.next(Math.round(100 * evt.loaded / evt.total));
          break;
        case HttpEventType.Response:
          downloadJs(evt.body as Blob, this.data.file.name, this.data.file.type);
          this.ref.close();
          break;
      }
    });
  }

}
