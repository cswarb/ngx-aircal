import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NgxAircalComponent } from './ngx-aircal/ngx-aircal.component';
import { NgxAircalUtilsService } from './ngx-aircal/services/ngx-aircal-utils.service';

@NgModule({
  declarations: [
    AppComponent,
    NgxAircalComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    NgxAircalUtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
