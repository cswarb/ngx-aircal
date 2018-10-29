import { NgModule, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxAircalComponent } from "./ngx-aircal.component";
import { AircalSelectComponent } from "./aircal-select/aircal-select.component";
import { AircalDaysselectedComponent } from "./aircal-daysselected/aircal-daysselected.component";
import { AircalDaysofweekComponent } from "./aircal-daysofweek/aircal-daysofweek.component";
import { AircalDayComponent } from "./aircal-day/aircal-day.component";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    NgxAircalComponent,
    AircalSelectComponent,
    AircalDaysselectedComponent,
    AircalDaysofweekComponent,
    AircalDayComponent
  ],
  exports: [
    NgxAircalComponent
  ],
  providers: [
    
  ],
  entryComponents: [
    NgxAircalComponent
  ]
})
export class NgxAircalModule {}