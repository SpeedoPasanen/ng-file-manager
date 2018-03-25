import { Injectable } from '@angular/core';
import { NgfmPerms } from '../ngfm/models/ngfm-perms';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { T } from '@angular/core/src/render3';
import { NgfmConfig } from '../ngfm/models/ngfm-config';

@Injectable()
export class ConfigResolverService {

  /**
   * You can check user permissions here.
   * @param route 
   * @param state 
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return route.data.config || new NgfmConfig({ perms: NgfmPerms.NONE });
  }
}
