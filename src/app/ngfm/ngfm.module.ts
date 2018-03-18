import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgfmRouteComponent } from './route/ngfm-route.component';
import { NgfmBrowserComponent } from './browser/ngfm-browser.component';
import { MatDialogModule, MatButtonModule, MatListModule, MatProgressBarModule, MatGridListModule, MatMenuModule, MatCheckboxModule, MatInputModule, MatSnackBarModule } from '@angular/material';

import { NgfmUploadDialogComponent } from './upload-dialog/ngfm-upload-dialog.component';
import { NgfmDialogHeaderComponent } from './dialog-header/ngfm-dialog-header.component';
import { NgfmBrowserItemToolsComponent } from './browser-item-tools/ngfm-browser-item-tools.component';
import { FormsModule } from '@angular/forms';
import { NgfmBrowserDialogComponent } from './browser-dialog/ngfm-browser-dialog.component';
import { NgfmDialogComponent } from './dialog/ngfm-dialog.component';
import { NgfmDialogService } from './dialog/ngfm-dialog.service';
import { NgfmApi } from './connectors/ngfm-api';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    MatGridListModule,
    MatMenuModule,
    MatCheckboxModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule
  ],
  exports: [],
  declarations: [
    NgfmRouteComponent,
    NgfmBrowserComponent,
    NgfmBrowserDialogComponent,
    NgfmUploadDialogComponent,
    NgfmDialogComponent,
    NgfmDialogHeaderComponent,
    NgfmBrowserItemToolsComponent,
  ],
  entryComponents: [NgfmBrowserDialogComponent, NgfmUploadDialogComponent, NgfmDialogComponent],
  providers: []
})
export class NgfmModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgfmModule,
      providers: [NgfmApi, NgfmDialogService]
    };
  }
}
