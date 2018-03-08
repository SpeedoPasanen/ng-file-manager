import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgfmRouteComponent } from './ngfm/ngfm-route/ngfm-route.component';
import { PrivateRouteService } from './services/private-route.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  {
    path: 'public',
    children: [
      {
        path: '**',
        component: NgfmRouteComponent,
        data: { root: ['public'] }
      }
    ]
  },
  {
    path: 'private',
    children: [
      {
        path: '**',
        component: NgfmRouteComponent,
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
