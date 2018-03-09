import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateRouteService } from './services/private-route.service';
import { NgfmRouteComponent } from './ngfm/public_api';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'files/public',
    pathMatch: 'full'
  },
  {
    path: 'files/public',
    children: [
      {
        path: '**',
        component: NgfmRouteComponent,
        data: {
          angularRoot: ['/files'],
          root: ['public']
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
          angularRoot: ['/files']
        },
        resolve: {
          root: PrivateRouteService
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
