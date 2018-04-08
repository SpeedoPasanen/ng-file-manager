import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NgfmModule } from './ngfm/ngfm.module';
import { PrivateRouteService } from './services/private-route.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigResolverService } from './services/config-resolver.service';
import { NGFM_CONNECTOR, NGFM_REST_CONFIG } from './ngfm/connectors/constants';
import { NgfmRestConnector } from './ngfm/connectors/rest/ngfm-rest.connector';
import { NgfmRestConfig } from './ngfm/connectors/rest/ngfm-rest.config';
import { MatButtonModule } from '@angular/material';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgfmModule.forRoot(),
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [
    PrivateRouteService,
    ConfigResolverService,
    /* {
       provide: NGFM_REST_CONFIG, useValue: new NgfmRestConfig({
         baseUrl: 'http://localhost:3000/files'
       })
     },
     { provide: NGFM_CONNECTOR, useClass: NgfmRestConnector }, */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
