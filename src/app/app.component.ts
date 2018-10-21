import { Component } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { AircalOptions, AircalDateModel, AircalDayLabels } from "./ngx-aircal/ngx-aircal.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public calendarOptions: AircalOptions = new AircalOptions();
  public form: FormGroup;

  constructor(
    private _FormBuilder: FormBuilder
  ) {
    this.calendarOptions = new AircalOptions({
      inlineMode: false,
      // defaultStart: new AircalDateModel({
      //   year: "2018", month: "11"
      // }),      
      // minYear: 2017,
      // maxYear: 2019,
      // disableFromHereBackwards: new AircalDateModel({
      //   year: "2018",
      //   month: "10",
      //   day: "14"
      // }),
      // disableFromHereForwards: new AircalDateModel({
      //   year: "2018",
      //   month: "10",
      //   day: "15"
      // }),
      // startDate: new AircalDateModel({
      //   year: "2018",
      //   month: "06",
      //   day: "27"
      // }),
      // endDate: new AircalDateModel({
      //   year: "2018",
      //   month: "10",
      //   day: "27"
      // }),
    });

    this.form = this._FormBuilder.group({
      dateRange: [{
        startDate: new AircalDateModel({
          year: "2018",
          month: "06",
          day: "27"
        }), endDate: new AircalDateModel({
          year: "2018",
          month: "08",
          day: "27"
        })
      }, Validators.required]
    });    
  }

  public setDateRange(): void {
    this.form.patchValue({
      dateRange: {
        startDate: new AircalDateModel({
          year: "2018",
          month: "06",
          day: "27"
        }),
        endDate: new AircalDateModel({
          year: "2018",
          month: "10",
          day: "27"
        })
      }
    });
  }

  public updateOptions() {
    this.calendarOptions = new AircalOptions({   
      minYear: 2017,
      maxYear: 2019,
      disableFromHereBackwards: new AircalDateModel({
        year: "2018",
        month: "10",
        day: "01"
      }),
      disableFromHereForwards: new AircalDateModel({
        year: "2018",
        month: "10",
        day: "30"
      }),
      // startDate: new AircalDateModel({
      //   year: "2018",
      //   month: "06",
      //   day: "27"
      // }),
      // endDate: new AircalDateModel({
      //   year: "2018",
      //   month: "10",
      //   day: "27"
      // }),
    });
  }

  public clearDateRange(): void {
    // Clear the date range using the patchValue function
    this.form.patchValue({ dateRange: "" });
  }

  public onSubmitReactiveForms() {
    console.log("form submit: ", this.form);
  }

  public onDateRangeCommitted(event: any) {
    console.log("date range committed: ", event);
  }
  
  public onDateRangeInitialised(event: any) {
    console.log("date range initialised: ", event);
  }

  public onDateRangeChanged(event: any) {
    console.log("date range changed: ", event);
  }

  public onInputFieldChanged(event: any) {
    console.log("input field changed: ", event);
  }

  public onDateRangeCleared(event: any) {
    console.log("date range cleared: ", event);
  }

  public onCalendarViewChanged(event: any) {
    console.log("calendar view changed: ", event);
  }

}