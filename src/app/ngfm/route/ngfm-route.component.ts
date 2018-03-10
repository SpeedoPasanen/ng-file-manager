import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmConfig } from '../models/ngfm-config';


@Component({
  selector: 'ngfm-ngfm-route',
  templateUrl: './ngfm-route.component.html',
  styleUrls: ['./ngfm-route.component.css']
})
export class NgfmRouteComponent implements OnInit {

  root$: Observable<string[]>;
  path$: Observable<string[]>;
  config$: Observable<NgfmConfig>;
  private angularRoot = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscribeToRoute();
  }
  subscribeToRoute() {
    this.route.data.subscribe(data => {
      this.angularRoot = data.angularRoot || [];
    });
    this.path$ = this.route.url.pipe(
      map((segments: UrlSegment[]) => segments.map(seg => seg.path).filter(path => !!path)),
    );
    this.root$ = this.route.data.pipe(map(data => data.root || []));
    this.config$ = this.route.data.pipe(
      map(data => new NgfmConfig(data.config || {}))
    );
  }
  navigated(folder: NgfmFolder) {
    this.router.navigate(this.angularRoot.concat(folder.path), { relativeTo: this.route });
  }
}
