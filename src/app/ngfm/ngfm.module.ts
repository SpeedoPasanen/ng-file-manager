import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgfmRouteComponent } from './ngfm-route/ngfm-route.component';
import { NgfmBrowserComponent } from './ngfm-browser/ngfm-browser.component';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { NgfmService } from './ngfm.service';
import { NgfmDialogComponent } from './ngfm-dialog/ngfm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [],
  declarations: [
    NgfmRouteComponent,
    NgfmBrowserComponent,
    NgfmDialogComponent
  ],
  entryComponents: [NgfmDialogComponent]
})
export class NgfmModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgfmModule,
      providers: [NgfmService]
    }
  }
}
