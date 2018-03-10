import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgfmRouteComponent } from './route/ngfm-route.component';
import { NgfmBrowserComponent } from './browser/ngfm-browser.component';
import { MatDialogModule, MatButtonModule, MatListModule, MatProgressBarModule, MatGridListModule } from '@angular/material';
import { NgfmDialogComponent } from './browser-dialog/ngfm-dialog.component';
import { NgfmService } from './service/ngfm.service';
import { NgfmUploadDialogComponent } from './upload-dialog/ngfm-upload-dialog.component';
import { NgfmDialogHeaderComponent } from './dialog-header/ngfm-dialog-header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgfmBrowserItemToolsComponent } from './browser-item-tools/ngfm-browser-item-tools.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    MatGridListModule,
    FlexLayoutModule,
  ],
  exports: [],
  declarations: [
    NgfmRouteComponent,
    NgfmBrowserComponent,
    NgfmDialogComponent,
    NgfmUploadDialogComponent,
    NgfmDialogHeaderComponent,
    NgfmBrowserItemToolsComponent,
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
