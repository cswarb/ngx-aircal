import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAircalComponent } from './ngx-aircal.component';
import { NgxAircalUtilsService } from './services/ngx-aircal-utils.service';
import { AircalSelectComponent } from './aircal-select/aircal-select.component';
import { AircalDaysselectedComponent } from './aircal-daysselected/aircal-daysselected.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxAircalComponent,
    AircalSelectComponent,
    AircalDaysselectedComponent
  ],
  exports: [
    NgxAircalComponent
  ],
  providers: [
    NgxAircalUtilsService
  ],
  entryComponents: [
    NgxAircalComponent
  ]
})
export class NgxAircalModule {}