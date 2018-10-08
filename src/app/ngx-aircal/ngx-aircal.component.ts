import { Component, Input, OnInit, Output, OnDestroy } from '@angular/core';
import * as moment from "moment";
import { Subject } from "rxjs";

import { AircalOptions, AircalResponse, AircalFormResponse } from "./ngx-aircal.model";

@Component({
  selector: 'ngx-aircal',
  templateUrl: './ngx-aircal.component.html'
})
export class NgxAircalComponent implements OnInit, OnDestroy {
  public date = moment();
  public nextMonthDate = moment().add(1, "month");
  public daysArray: Array<any> = [];
  public nextMonthDaysArray: Array<any> = [];
  public calendarSpaces: number = 35;

  public selectedStartDate = null;
  public selectedEndDate = null;
  public numberOfDaysSelected: any = {
    days: 0,
    months: 0,
    years: 0
  };

  //Helpers
  public ObjectKeys: Function = Object.keys;

  //Options
  @Input() options: AircalOptions = new AircalOptions();

  //Events
  @Output() onDateRangeCommitted: Subject<any> = new Subject();
  @Output() onInputFieldChanged: Subject<any> = new Subject();
  @Output() onCalendarViewChanged: Subject<any> = new Subject();
  @Output() onDateRangeCleared: Subject<any> = new Subject();
  @Output() onDateRangeChanged: Subject<any> = new Subject();

  constructor() {
    console.log(this.options, "options");
  }

  ngOnDestroy() {
    this.onDateRangeCommitted.unsubscribe();
    this.onInputFieldChanged.unsubscribe();
    this.onCalendarViewChanged.unsubscribe();
    this.onDateRangeCleared.unsubscribe();
    this.onDateRangeChanged.unsubscribe();
  }

  ngOnInit() {
    this.daysArray = this.createAircal(this.date);
    this.nextMonthDaysArray = this.createAircal(moment(this.date).add(1, "month"));
  }

  public prevMonth(): any {
    this.date = this.date.subtract(1, "month");
    this.nextMonthDate = moment(this.date).add(1, "month");
    this.daysArray = this.createAircal(this.date);
    this.nextMonthDaysArray = this.createAircal(this.nextMonthDate);
    this.calendarViewChanged();
  }

  public nextMonth(): any {
    this.date = this.date.add(1, "month");
    this.nextMonthDate = moment(this.date).add(1, "month");
    this.daysArray = this.createAircal(this.date);
    this.nextMonthDaysArray = this.createAircal(this.nextMonthDate);
    this.calendarViewChanged();
  }

  public createAircal(date: Object): Array<any> {
    var currentMonth = moment(date).startOf("month"),
        nextMonth = moment(currentMonth).add(1, "months"),
        days = Array.from(new Array(currentMonth.daysInMonth()).keys());

    var calendarDays = days.map((e) => {
      return moment(currentMonth).add(e, "day");
    });

    //Pull in the previous months values to fill in the empty space
    for (let i = 1; i < currentMonth.weekday(); i++) {
      let previousWrapArounddateObj = null;

        if (this.options.previousMonthWrapAround) {
          previousWrapArounddateObj = moment(date).startOf("month").subtract(i + 1, "day");
          previousWrapArounddateObj["isLastMonth"] = true; //@todo - Fix this
        };

      calendarDays.unshift(previousWrapArounddateObj);
    };
    
    //See if there is any space left for next months wraparound
    let iterator = 0;
    while (calendarDays.length < this.calendarSpaces) {
        let nextWrapArounddateObj = null;
        
        if (this.options.nextMonthWrapAround) {
            nextWrapArounddateObj = moment(date).startOf("month").add(iterator, "day");
            nextWrapArounddateObj["isNextMonth"] = true; //@todo - Fix this
        };

        iterator = iterator + 1;
        calendarDays.push(nextWrapArounddateObj);
    };

    return calendarDays;
  }

    public isToday(date: any) {
        if (!date || !this.options.highlightToday) return false;
        return moment().format("L") === date.format("L");
    }

    public selectDate(date: any) {
        if (!date || date.isLastMonth || date.isNextMonth) return;

        if (!this.selectedStartDate) {
            this.selectedStartDate = date;
        } else {
            this.selectedEndDate = date;
        };

        //calculate number of days between start and end
        if (this.options.daysSelectedCounterVisible) {
            if (this.selectedStartDate && this.selectedEndDate) {
                let selectedDays = moment.duration(this.selectedEndDate.diff(this.selectedStartDate));
                this.numberOfDaysSelected.days = Math.round(selectedDays.asDays());
                this.numberOfDaysSelected.months = Math.round(selectedDays.asMonths());
                this.numberOfDaysSelected.years = Math.round(selectedDays.asYears());
            };
        };

        //Fire event
        this.dateRangeChanged();
    }

    public isSelected(date: any) {
        if (!date) return false;

        if (!!this.selectedStartDate && !!this.selectedEndDate) {
            return this.selectedStartDate.isSameOrBefore(date) && this.selectedEndDate.isSameOrAfter(date);
        };

        if (this.selectedStartDate) {
            return this.selectedStartDate.isSame(date);
        }
    }

  public dateRangeCommitted() {
    this.onDateRangeCommitted.next(
      new AircalResponse(
        this.selectedStartDate,
        this.selectedEndDate
      )
    );
  }

  public dateRangeChanged() {
    this.onDateRangeChanged.next(
      new AircalResponse(
        this.selectedStartDate,
        this.selectedEndDate
      )
    );
  }

  public inputFieldChanged() {
    this.onInputFieldChanged.next(
      new AircalFormResponse(
        this.selectedStartDate,
        this.selectedEndDate,
        true
      )
    );
  }

  public calendarViewChanged() {
    this.onCalendarViewChanged.next(
      new AircalFormResponse(
        this.selectedStartDate,
        this.selectedEndDate,
        true
      )
    );
  }

  public dateRangeCleared() {
    this.selectedEndDate = null;
    this.selectedStartDate = null;
    this.numberOfDaysSelected.days = 0;
    this.numberOfDaysSelected.months = 0;
    this.numberOfDaysSelected.years = 0;

    this.onDateRangeCleared.next(
      new AircalFormResponse(
        this.selectedStartDate,
        this.selectedEndDate,
        true
      )
    );
  }

}