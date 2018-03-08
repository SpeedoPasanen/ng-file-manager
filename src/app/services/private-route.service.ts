import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs/observable/of';
@Injectable()
export class PrivateRouteService {

  constructor() { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return of(['private', 2]);
  }
}
