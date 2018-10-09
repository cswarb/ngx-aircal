import { Component } from '@angular/core';

import { AircalOptions, AircalDateModel } from "./ngx-aircal/ngx-aircal.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public calendarOptions;

  constructor() {
    this.calendarOptions = new AircalOptions({
      applyText: "Set Date",
      clearText: "Clear me"
    });
  }

  public onDateRangeCommitted(event: any) {
    console.log("date range committed: ", event);
  }

  public onDateRangeChanged(event: any) {
    console.log("date range changed: ", event);
  }

  public onInputFieldChanged(event: any) {
    console.log("input field changed: ", event);
  }

  public onDateRangeCleared(event: any) {
    console.log("date rangecleared: ", event);
  }

  public onCalendarViewChanged(event: any) {
    console.log("calendar view changed: ", event);
  }

}