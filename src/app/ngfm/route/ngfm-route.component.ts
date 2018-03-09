import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { map, tap } from 'rxjs/operators';


@Component({
  selector: 'ngfm-ngfm-route',
  templateUrl: './ngfm-route.component.html',
  styleUrls: ['./ngfm-route.component.css']
})
export class NgfmRouteComponent implements OnInit {

  root$: Observable<string[]>;
  path$: Observable<string[]>;
  private currentPath: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.subscribeToRoute();
    // this.path$.subscribe(p => console.log('RouteC Path', p));
    // this.root$.subscribe(r => console.log('RouteC Root', r));
  }
  subscribeToRoute() {
    this.path$ = this.route.url.pipe(
      map((segments: UrlSegment[]) => segments.map(seg => seg.path).filter(path => !!path)),
    );
    this.root$ = this.route.data.pipe(map(data => data.root || []));
  }
  navigated(urlPart: string) {
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
