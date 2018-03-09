import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { NgfmFolder } from '../models/public_api';


@Component({
  selector: 'ngfm-ngfm-route',
  templateUrl: './ngfm-route.component.html',
  styleUrls: ['./ngfm-route.component.css']
})
export class NgfmRouteComponent implements OnInit {

  root$: Observable<string[]>;
  path$: Observable<string[]>;
  private currentPath: string;
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
  }
  navigated(folder: NgfmFolder) {
    this.router.navigate(this.angularRoot.concat(folder.fullPath));
    /* const parts = ['/files', ...this.currentRoot.split('/')];
     if (urlPart === '..') {
       parts.pop();
     } else {
       parts.push(urlPart);
     }
     this.router.navigate(parts.filter(p => p.length && (p !== '/')));
     */
  }
}
