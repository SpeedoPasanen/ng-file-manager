import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgfmRouteComponent } from './route/ngfm-route.component';
import { NgfmBrowserComponent } from './browser/ngfm-browser.component';
import { MatDialogModule, MatButtonModule, MatListModule, MatProgressBarModule } from '@angular/material';
import { NgfmDialogComponent } from './browser-dialog/ngfm-dialog.component';
import { NgfmService } from './service/ngfm.service';
import { NgfmUploadDialogComponent } from './upload-dialog/ngfm-upload-dialog.component';
import { NgfmDialogHeaderComponent } from './dialog-header/ngfm-dialog-header.component';
import { NgfmMemoryConnector } from './public_api';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule
  ],
  exports: [],
  declarations: [
    NgfmRouteComponent,
    NgfmBrowserComponent,
    NgfmDialogComponent,
    NgfmUploadDialogComponent,
    NgfmDialogHeaderComponent,
  ],
  entryComponents: [NgfmDialogComponent, NgfmUploadDialogComponent],
  providers: []
})
export class NgfmModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgfmModule,
      providers: [NgfmService]
    };
  }
}
