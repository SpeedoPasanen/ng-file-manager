import { Component, OnInit, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';
import { NgfmFolder } from '../models/ngfm-folder';
import { NgfmConfig } from '../models/ngfm-config';
import { combineLatest } from 'rxjs/observable/combineLatest';


@Component({
  selector: 'ngfm-ngfm-route',
  templateUrl: './ngfm-route.component.html',
  styleUrls: ['./ngfm-route.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgfmRouteComponent implements OnInit {
  @HostBinding('class.ngfm-route-component') private _hostClass = true;

  folder$: Observable<NgfmFolder>;
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
    this.folder$ = combineLatest(
      this.route.data.pipe(map(data => data.root || [])),
      this.route.url.pipe(
        map((segments: UrlSegment[]) => segments.map(seg => seg.path).filter(path => !!path)),
      ),
    ).pipe(
      map(([root, path]) => new NgfmFolder(root, path)),
      distinctUntilChanged((a, b) => a.hash === b.hash),
      tap(console.log)
    );
    this.config$ = this.route.data.pipe(
      map(data => new NgfmConfig(data.config || {}))
    );
  }
  navigated(folder: NgfmFolder) {
    this.router.navigate(this.angularRoot.concat(folder.path), { relativeTo: this.route });
  }
}
