import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgfmRouteComponent } from './ngfm-route/ngfm-route.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [],
  declarations: [
    NgfmRouteComponent
  ]
})
export class NgfmModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgfmModule,
      providers: []
    }
  }
}
