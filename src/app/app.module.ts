import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// import { NgxAircalModule } from './ngx-aircal/ngx-aircal.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxAircalModule } from 'ngx-aircal';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NgxAircalModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
