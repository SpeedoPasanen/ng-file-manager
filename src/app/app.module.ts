import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NgfmModule } from './ngfm/ngfm.module';
import { PrivateRouteService } from './services/private-route.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgfmModule.forRoot()
  ],
  providers: [PrivateRouteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
