import { Component } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { AircalOptions, AircalResponse, AircalInputResponse } from "ngx-aircal";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public calendarOptions: AircalOptions = new AircalOptions();
  public form: FormGroup;
  public dateRange: any;

  constructor(
    private _FormBuilder: FormBuilder
  ) {
    this.calendarOptions = new AircalOptions({
      // inlineMode: true,
      // backgroundVisible: false,
      allowQuicksetMonth: true,
      allowQuicksetYear: true,
      startDate: new Date(2019, 0, 18),
      endDate: new Date(2019, 0, 19),
      disableFromHereBackwards: new Date(2019, 0, 15),
      disableFromHereForwards: new Date(2019, 0, 20)
      // singlePicker: true
    });

    // this.dateRange = {
    //   startDate: new Date(
    //     2018,
    //     6,
    //     27
    //   ), 
    //   endDate: new Date(
    //     2018,
    //     8,
    //     27
    //   )
    // };

    // this.form = this._FormBuilder.group({
    //   dateRange: [{
    //     // startDate: new AircalDateModel({
    //     //   year: "2018",
    //     //   month: "06",
    //     //   day: "27"
    //     // }), endDate: new AircalDateModel({
    //     //   year: "2018",
    //     //   month: "08",
    //     //   day: "27"
    //     // })
    //   }, Validators.required]
    // });    
  }

  public setDateRange(): void {
    // this.form.patchValue({
    //   dateRange: {
    //     startDate: new Date(
    //       2018,
    //       6,
    //       27
    //     ),
    //     endDate: new Date(
    //       2018,
    //       10,
    //       27
    //     )
    //   }
    // });

    this.dateRange = {
      startDate: new Date(
        2019,
        0,
        17
      ), 
      endDate: new Date(
        2019,
        0,
        17
      )
    };
  }

  public updateOptions() {
    console.log(this.dateRange);
    
    // this.calendarOptions = new AircalOptions({   
    //   minYear: 2017,
    //   maxYear: 2019,
    //   disableFromHereBackwards: new AircalDateModel({
    //     year: "2018",
    //     month: "10",
    //     day: "01"
    //   }),
    //   disableFromHereForwards: new AircalDateModel({
    //     year: "2018",
    //     month: "10",
    //     day: "30"
    //   }),
    //   // startDate: new AircalDateModel({
    //   //   year: "2018",
    //   //   month: "06",
    //   //   day: "27"
    //   // }),
    //   // endDate: new AircalDateModel({
    //   //   year: "2018",
    //   //   month: "10",
    //   //   day: "27"
    //   // }),
    // });
  }

  public clearDateRange(): void {
    // Clear the date range using the patchValue function
    // this.form.patchValue({ dateRange: "" });

    this.dateRange = null;
  }

  public onSubmitReactiveForms() {
    console.log("form submit: ", this.form);
  }

  public onDateRangeCommitted(event: AircalResponse) {
    console.log("date range committed: ", event);
  }
  
  public onDateRangeInitialised(event: AircalResponse) {
    console.log("date range initialised: ", event);
  }

  public onDateRangeChanged(event: AircalResponse) {
    console.log("date range changed: ", event);
  }

  public onInputFieldChanged(event: AircalInputResponse) {
    console.log("input field changed: ", event);
  }

  public onDateRangeCleared(event: AircalResponse) {
    console.log("date range cleared: ", event);
  }

  public onCalendarViewChanged(event: AircalResponse) {
    console.log("calendar view changed: ", event);
  }

}