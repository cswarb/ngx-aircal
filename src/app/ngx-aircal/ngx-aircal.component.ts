import { Component, Input, OnInit, Output, OnDestroy } from '@angular/core';
import * as moment from "moment";
import { Subject } from "rxjs";

import { AircalOptions, AircalResponse, AircalFormResponse, AIRCAL_CALENDAR_SPACES, AIRCAL_CALENDAR_SHORTCUT_SEPARATOR, AircalModel } from "./ngx-aircal.model";
import { NgxAircalUtilsService } from './services/ngx-aircal-utils.service';

@Component({
    selector: "ngx-aircal",
    templateUrl: "./ngx-aircal.component.html"
})
export class NgxAircalComponent implements OnInit, OnDestroy {
    public date = moment();
    public nextMonthDate = moment().add(1, "month");
    public daysArray: Array<any> = [];
    public nextMonthDaysArray: Array<any> = [];
    public allDaysArray: Array<any> = [];
    public calendarSpaces: number = AIRCAL_CALENDAR_SPACES;

    public selectedStartDate = null;
    public selectedEndDate = null;
    public numberOfDaysSelected: any = {
        days: 0,
        months: 0,
        years: 0
    };

    //Flags
    public disableForwardSelection: boolean = false;
    public disablePreviousSelection: boolean = false;

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

    constructor(
        private _NgxAircalUtilsService: NgxAircalUtilsService
    ) {
        console.log(this._NgxAircalUtilsService);
        
    }

    ngOnDestroy() {
        this.onDateRangeCommitted.unsubscribe();
        this.onInputFieldChanged.unsubscribe();
        this.onCalendarViewChanged.unsubscribe();
        this.onDateRangeCleared.unsubscribe();
        this.onDateRangeChanged.unsubscribe();
    }

    public selectionShortcutChanged(shortcut: string): void {
        if(!this.selectedStartDate) return;

        //Get the amount of time to be selected
        const timeMeasurement = this.getShortcutStrucutre(shortcut);
        const newSelectedEndDate = moment(this.selectedStartDate).add(timeMeasurement.time, timeMeasurement.unit);
        
        //Set the end date
        if (newSelectedEndDate.year() < this.options.maxYear) {
            this.selectedEndDate = newSelectedEndDate;
        };
    }

    private getShortcutStrucutre(shortcut: string): any {
        const shortcutData = shortcut.split(AIRCAL_CALENDAR_SHORTCUT_SEPARATOR);
        return {
            time: shortcutData[0],
            unit: shortcutData[1]
        };
    }

    public isHovering(cell: any) {
        if (
            (this.selectedStartDate && this.selectedEndDate) || 
            (!this.selectedStartDate && this.selectedEndDate) ||
            (!this.selectedStartDate && !this.selectedEndDate)
        ) return;
        
        for (let date of this.allDaysArray) {
            if(
                date > this.selectedStartDate &&
                date <= cell
            ) {
                date = date["highlight"] = true;
            };
        };
    }
    
    public isLeaving(cell: any) {
        for (let date of this.allDaysArray) {
            if (
                date > this.selectedStartDate &&
                date <= cell
            ) {
                date = date["highlight"] = false;
            };
        }; 
    }

    private removeRangeHighlighting() {
        for (let date of this.allDaysArray) {
            date = date["highlight"] = false;
        };
    }

    ngOnInit() {
        console.log(this.options, "options");

        //Initialise start and end date from options is valid
        if(this.options.startDate) {
            this.selectedStartDate = moment(
                `${this.options.startDate.year}${this.options.startDate.month}${this.options.startDate.day}`
            );
        };

        if(this.options.endDate) {
            this.selectedEndDate = moment(
                `${this.options.endDate.year}${this.options.endDate.month}${this.options.endDate.day}`
            );
        };

        if(this.options.defaultStart) {
            this.date = moment(
            `${this.options.defaultStart.year}${this.options.defaultStart.month}${this.options.defaultStart.day}`
            );

            this.nextMonthDate = moment(this.date).add(1, "month");
        };

        this.daysArray = this.createAircal(this.date);
        this.nextMonthDaysArray = this.createAircal(this.nextMonthDate);
        this.allDaysArray = this.daysArray.concat(this.nextMonthDaysArray);
    }

    public canSelectPreviousMonth(): boolean {
        //See what year the user will be navigating to
        var goingToYear = moment(this.date).subtract(1, "month").year();

        //Compare to the minYear option
        return !!(goingToYear > this.options.minYear);
    }
  
    public canSelectNextMonth(): boolean {
        //See what year the user will be navigating to
        var goingToYear = moment(this.nextMonthDate).add(1, "month").year();

        //Compare to the minYear option
        return !!(goingToYear < this.options.maxYear);
    }

    public prevMonth(): any {
        if (this.canSelectPreviousMonth()) {
            this.date = this.date.subtract(1, "month");
            this.nextMonthDate = moment(this.date).add(1, "month");
            this.daysArray = this.createAircal(this.date);
            this.nextMonthDaysArray = this.createAircal(this.nextMonthDate);
            this.allDaysArray = this.daysArray.concat(this.nextMonthDaysArray);
            this.calendarViewChanged();
        };

        //Check the month before to see if we should disable the button
        if (!this.canSelectPreviousMonth()) {
            this.disablePreviousSelection = true;
        };

        //Check the month after to see if we should disable the button
        if (this.canSelectNextMonth()) {
            // disableForwardSelection
            // disablePreviousSelection
            this.disableForwardSelection = false;
        };
    }

    public nextMonth(): any {
        if (this.canSelectNextMonth()) {
            this.date = this.date.add(1, "month");
            this.nextMonthDate = moment(this.date).add(1, "month");
            this.daysArray = this.createAircal(this.date);
            this.nextMonthDaysArray = this.createAircal(this.nextMonthDate);
            this.allDaysArray = this.daysArray.concat(this.nextMonthDaysArray);
            this.calendarViewChanged();
        };

        //Check the month before to see if we should disable the button
        if (this.canSelectPreviousMonth()) {
            this.disablePreviousSelection = false;
        };

        //Check the month after to see if we should disable the button
        if (!this.canSelectNextMonth()) {
            this.disableForwardSelection = true;
        };
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
                previousWrapArounddateObj = moment(date).startOf("month").subtract(i, "day");
                previousWrapArounddateObj["isLastMonth"] = true; //@todo - Fix this
            };

            calendarDays.unshift(previousWrapArounddateObj);
        };

        //See if there is any space left for next months wraparound
        let iterator = 0;
        while (calendarDays.length < this.calendarSpaces) {
            let nextWrapArounddateObj = null;
            
            if (this.options.nextMonthWrapAround) {
                nextWrapArounddateObj = moment(date).add(1, "month").startOf("month").add(iterator, "day");
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
        } else if (this.selectedStartDate && !this.selectedEndDate) {
            this.selectedEndDate = date;
        } else {
            //both are selected - is the date selected closer to the start or the end?          
            var diffFromStart = Math.abs(Math.round(moment.duration(moment(date).diff(this.selectedStartDate)).as("days"))),
                diffFromEnd = Math.abs(Math.round(moment.duration(moment(date).diff(this.selectedEndDate)).as("days")));

            if (diffFromStart > diffFromEnd) {
                this.selectedEndDate = date;
            } else {
                this.selectedStartDate = date;
            };

            //calculate number of days between start and end
            if (this.options.daysSelectedCounterVisible) {
                let selectedDays = moment.duration(this.selectedEndDate.diff(this.selectedStartDate));
                this.numberOfDaysSelected.days = Math.round(selectedDays.asDays());
                this.numberOfDaysSelected.months = Math.round(selectedDays.asMonths());
                this.numberOfDaysSelected.years = Math.round(selectedDays.asYears());
            };
        };

        //Remove any highlighting
        this.removeRangeHighlighting();

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
            this.selectedEndDate,
            moment(this.selectedStartDate).format(this.options.dateFormat),
            moment(this.selectedEndDate).format(this.options.dateFormat),
            )
        );
    }

    public dateRangeChanged() {
        this.onDateRangeChanged.next(
            new AircalResponse(
            this.selectedStartDate,
            this.selectedEndDate,
            moment(this.selectedStartDate).format(this.options.dateFormat),
            moment(this.selectedEndDate).format(this.options.dateFormat),
            )
        );
    }

    public inputFieldChanged() {
        this.onInputFieldChanged.next(
            new AircalFormResponse(
            this.selectedStartDate,
            this.selectedEndDate,
            moment(this.selectedStartDate).format(this.options.dateFormat),
            moment(this.selectedEndDate).format(this.options.dateFormat),
            true
            )
        );
    }

    public calendarViewChanged() {
        this.onCalendarViewChanged.next();
    }

    public dateRangeCleared() {
        var airModel = new AircalModel();
        airModel.selectedStartDate = null;
        airModel.selectedEndDate = null;
        airModel.numberOfDaysSelected.days = 0;
        airModel.numberOfDaysSelected.months = 0;
        airModel.numberOfDaysSelected.years = 0;

        this.onDateRangeCleared.next(
            new AircalFormResponse(
            this.selectedStartDate,
            this.selectedEndDate,
            moment(this.selectedStartDate).format(this.options.dateFormat),
            moment(this.selectedEndDate).format(this.options.dateFormat),
            true
            )
        );

        this.selectedStartDate = airModel.selectedStartDate;
        this.selectedEndDate = airModel.selectedEndDate;
        this.numberOfDaysSelected.days = airModel.numberOfDaysSelected.days;
        this.numberOfDaysSelected.months = airModel.numberOfDaysSelected.months;
        this.numberOfDaysSelected.years = airModel.numberOfDaysSelected.years;
    }

}