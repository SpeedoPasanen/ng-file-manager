import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateRouteService } from './services/private-route.service';
import { NgfmRouteComponent } from './ngfm/public_api';
import { NgfmConfig } from './ngfm/models/ngfm-config';
import { NgfmPerms } from './ngfm/models/ngfm-perms';
import { ConfigResolverService } from './services/config-resolver.service';

const routes: Routes = [
  {
    path: 'files/public',
    children: [
      {
        path: '**',
        component: NgfmRouteComponent,
        data: {
          angularRoot: ['/files/public'],
          root: ['public']
        },
        resolve: {
          config: ConfigResolverService
        }
      }
    ]
  },
  {
    path: 'files/private',
    children: [
      {
        path: '**',
        component: NgfmRouteComponent,
        data: {
          angularRoot: ['/files/private'],
          config: { perms: NgfmPerms.ALL }
        },
        resolve: {
          root: PrivateRouteService
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'files/private',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
