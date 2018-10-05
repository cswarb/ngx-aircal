import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NgxAircalComponent } from './ngx-aircal/ngx-aircal.component';


@NgModule({
  declarations: [
    AppComponent,
    NgxAircalComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
