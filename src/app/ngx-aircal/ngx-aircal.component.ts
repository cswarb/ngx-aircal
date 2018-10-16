import { Component, Input, OnInit, Output, OnDestroy, forwardRef, OnChanges } from '@angular/core';
import * as moment from "moment";
import { Subject } from "rxjs";

import { AircalOptions, AircalResponse, AircalFormResponse, AIRCAL_CALENDAR_SPACES, AIRCAL_CALENDAR_SHORTCUT_SEPARATOR, AircalModel, AircalSelectedTime, AircalDateModel } from "./ngx-aircal.model";
import { NgxAircalUtilsService } from "./services/ngx-aircal-utils.service";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

export const MYDRP_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxAircalComponent),
    multi: true
};

@Component({
    selector: "[data-ngx-aircal]",
    templateUrl: "./ngx-aircal.component.html",
    providers: [MYDRP_VALUE_ACCESSOR]
})
export class NgxAircalComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
    //Props
    public date = moment();
    public nextMonthDate = moment().add(1, "month");
    public daysArray: Array<any> = [];
    public nextMonthDaysArray: Array<any> = [];
    public allDaysArray: Array<any> = [];
    public calendarSpaces: number = AIRCAL_CALENDAR_SPACES;
    public invalidDateRange: boolean = false;
    public showCalendar: boolean = false;

    //Form
    onChangeCb: (_: any) => void = () => { };
    onTouchedCb: () => void = () => { };

    //Form model
    public formSelectionText: string = "";

    //Model
    public aircal: AircalModel = new AircalModel();

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
        
    }

    ngOnDestroy() {
        this.onDateRangeCommitted.unsubscribe();
        this.onInputFieldChanged.unsubscribe();
        this.onCalendarViewChanged.unsubscribe();
        this.onDateRangeCleared.unsubscribe();
        this.onDateRangeChanged.unsubscribe();
    }

    ngOnInit() {
        this.intialiseCalendar();
    }

    public openCalendar(): void {
        this.showCalendar = !this.showCalendar;
    }

    public intialiseCalendar(): void {
        //Initialise start and end date from options is valid
        if (this.options.startDate.isValid()) {
            this.aircal.selectedStartDate = moment(
                this.options.startDate.toDateStr()
            );
            this.selectDate(this.aircal.selectedStartDate);
        };

        if (this.options.endDate.isValid()) {
            this.aircal.selectedEndDate = moment(
                this.options.endDate.toDateStr()
            );
            this.selectDate(this.aircal.selectedEndDate);
        };

        if (this.options.defaultStart.isValid()) {
            this.date = moment(
                this.options.defaultStart.toDateStr()
            );

            this.nextMonthDate = moment(this.date).add(1, "month");
        };

        this.createCalendars();
    }

    /**
     * Reactive form / ngModel / Options updates change detection
     */
    private formatDate(date: any): string {
        // let formatted: string = this.opts.dateFormat.replace("yyyy", val.year).replace("dd", this.preZero(val.day));
        return moment(date).format(this.options.dateFormat)
    }

    public writeValue(value: {startDate?: any, endDate?: any}): void {
        //The initial form value passed from the parent must be written in here...
        console.log("writeValue: ", value);
        
        if (value && value.startDate && value.endDate) {
            this.aircal.selectedStartDate = moment(this.parseSelectedDate(value.startDate).toDateStr());
            this.aircal.selectedEndDate = moment(this.parseSelectedDate(value.endDate).toDateStr());

            let begin: string = this.formatDate(this.parseSelectedDate(value.startDate).toDateStr()),
                end: string = this.formatDate(this.parseSelectedDate(value.endDate).toDateStr());

            // if (begin && end) {
            //     this.invalidDateRange = false;
            // } else {
            //     this.invalidDateRange = true;
            //     return;
            // };

            this.formSelectionText = begin + " - " + end;

            //calculate number of days between start and end
            if (this.options.daysSelectedCounterVisible) {
                let selectedDays = moment.duration(this.aircal.selectedEndDate.diff(this.aircal.selectedStartDate));
                this.aircal.numberOfDaysSelected.days = Math.round(selectedDays.asDays());
            };

            // this.inputFieldChanged.emit({ value: this.selectionDayTxt, dateRangeFormat: this.dateRangeFormat, valid: true });
        } else if (value === null || value === "") {
            this.dateRangeCleared();
            // this.inputFieldChanged.emit({ value: "", dateRangeFormat: this.dateRangeFormat, valid: false });
        };
    }
    private parseSelectedDate(selectedDate: AircalDateModel | string): AircalDateModel {
        //Take into account date format
        let date: AircalDateModel = new AircalDateModel();

        console.log("selectedDate: ", selectedDate);
        

        if (typeof selectedDate === "string") {
            let sd: string = "" + selectedDate;
            // moment([2012, 0, 31]).month(1).format(this.options.dateFormat);
            // date.day = moment().days();

            // date.month = 

            // date.year = 
        } else if (typeof selectedDate === "object") {
            date = selectedDate;
        };

        return date;
    }

    public registerOnChange(fn: any): void {
        // this.onChangeCb = fn;
    }

    public registerOnTouched(fn: any): void {
        // this.onTouchedCb = fn;
    }

    ngOnChanges(value) {
        //When options values change, this fires...
        console.log("ngOnChanges: ", value);
        this.intialiseCalendar();
    }

    public onUserDateRangeInput(value: string) {
        //When the form has a date manually entered, this fires...
        //What if the calendar changes it itself though? It needs to update the form.
        console.log("onUserDateRangeInput: ", value);
        
        if (value.length === 0) {
            // if (this.drus.isInitializedDate(this.beginDate) && this.drus.isInitializedDate(this.endDate)) {
            //     this.clearDateRange();
            // }
            // else {
            //     this.inputFieldChanged.emit({ value: value, dateRangeFormat: this.dateRangeFormat, valid: false });
            // }
        } else {
            // let daterange: IMyDateRange = this.drus.isDateRangeValid(value, this.opts.dateFormat, this.opts.minYear, this.opts.maxYear, this.opts.disableUntil, this.opts.disableSince, this.opts.disableDates, this.opts.disableDateRanges, this.opts.enableDates, this.opts.monthLabels);
            // if (this.drus.isInitializedDate(daterange.beginDate) && this.drus.isInitializedDate(daterange.endDate)) {
            //     // this.beginDate = daterange.beginDate;
            //     // this.endDate = daterange.endDate;
            //     // this.rangeSelected();
            // }
            // else {
            //     this.onChangeCb(null);
            //     this.onTouchedCb();
            }
    }


    /**
     * Calendar functions
     */
    private createCalendars(): void {
        //Ensure this.date and this.nextMonthDate are calculated and set beforehand
        this.daysArray = this.createAircal(this.date);
        this.nextMonthDaysArray = this.createAircal(this.nextMonthDate);
        this.allDaysArray = this.daysArray.concat(this.nextMonthDaysArray);
    }

    public selectionShortcutChanged(shortcut: string): void {
        if (!this.aircal.selectedStartDate) return;

        //Get the amount of time to be selected
        const timeMeasurement = this._NgxAircalUtilsService.getShortcutStrucutre(shortcut),
            newSelectedEndDate = moment(this.aircal.selectedStartDate).add(timeMeasurement.time, timeMeasurement.unit);

        //Set the end date
        if (newSelectedEndDate.year() < this.options.maxYear) {
            this.selectDateShortcut(newSelectedEndDate);
        };
    }

    public isHovering(cell: any): void {
        if (
            (this.aircal.selectedStartDate && this.aircal.selectedEndDate) ||
            (!this.aircal.selectedStartDate && this.aircal.selectedEndDate) ||
            (!this.aircal.selectedStartDate && !this.aircal.selectedEndDate)
        ) return;

        for (let date of this.allDaysArray) {
            if (
                this._NgxAircalUtilsService.isWithinRange(date, cell, this.aircal.selectedStartDate)
            ) {
                date = date["highlight"] = true;
            };
        };
    }

    public isLeaving(cell: any): void {
        for (let date of this.allDaysArray) {
            if (
                this._NgxAircalUtilsService.isWithinRange(date, cell, this.aircal.selectedStartDate)
            ) {
                date = date["highlight"] = false;
            };
        };
    }

    private removeRangeHighlighting(): void {
        for (let date of this.allDaysArray) {
            date = date["highlight"] = false;
        };
    }

    public canSelectPreviousMonth(): boolean {
        //See what year the user will be navigating to
        const goingToYear = moment(this.date).subtract(1, "month").year();

        //Compare to the minYear option
        return !!(goingToYear > this.options.minYear);
    }
  
    public canSelectNextMonth(): boolean {
        //See what year the user will be navigating to
        const goingToYear = moment(this.nextMonthDate).add(1, "month").year();

        //Compare to the minYear option
        return !!(goingToYear < this.options.maxYear);
    }

    public prevMonth(): void {
        if (this.canSelectPreviousMonth()) {
            this.date = this.date.subtract(1, "month");
            this.nextMonthDate = moment(this.date).add(1, "month");
            this.createCalendars();
            this.calendarViewChanged();
        };

        //Check the month before to see if we should disable the button
        if (!this.canSelectPreviousMonth()) {
            this.aircal.disablePreviousSelection = true;
        };

        //Check the month after to see if we should disable the button
        if (this.canSelectNextMonth()) {
            // disableForwardSelection
            // disablePreviousSelection
            this.aircal.disableForwardSelection = false;
        };
    }

    public nextMonth(): void {
        if (this.canSelectNextMonth()) {
            this.date = this.date.add(1, "month");
            this.nextMonthDate = moment(this.date).add(1, "month");
            this.createCalendars();
            this.calendarViewChanged();
        };

        //Check the month before to see if we should disable the button
        if (this.canSelectPreviousMonth()) {
            this.aircal.disablePreviousSelection = false;
        };

        //Check the month after to see if we should disable the button
        if (!this.canSelectNextMonth()) {
            this.aircal.disableForwardSelection = true;
        };
    }

    public createAircal(date: Object): Array<any> {
        const currentMonth = moment(date).startOf("month"),
            nextMonth = moment(currentMonth).add(1, "months"),
            days = Array.from(new Array(currentMonth.daysInMonth()).keys());

        let calendarDays = days.map((day: any) => {
            let newDay = moment(currentMonth).add(day, "day");

            //Check for disabled dates
            if (this.options.disableFromHereBackwards || this.options.disableFromHereForwards) {
                const fromHereBackwards = moment(this.options.disableFromHereBackwards.toDateStr()),
                    fromHereForwards = moment(this.options.disableFromHereForwards.toDateStr());;
                if (newDay < fromHereBackwards || newDay > fromHereForwards) {
                    newDay["disabled"] = true;
                };
            };

            return newDay;
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

    public isToday(date: any): boolean {
        if (!date || !this.options.highlightToday) return false;
        return moment().format("L") === date.format("L");
    }

    private selectDateShortcut(newEndDate: any) {        
        this.aircal.selectedEndDate = newEndDate;

        //calculate number of days between start and end
        if (this.options.daysSelectedCounterVisible) {
            if (!this.aircal.selectedEndDate) return;
            let selectedDays = moment.duration(this.aircal.selectedEndDate.diff(this.aircal.selectedStartDate));
            this.aircal.numberOfDaysSelected.days = Math.round(selectedDays.asDays());
        };

        //Fire event
        this.dateRangeChanged();
    }

    public selectDate(date: any): void {
        if (!date || date.isLastMonth || date.isNextMonth) return;

        if (!this.aircal.selectedStartDate) {
            this.aircal.selectedStartDate = date;
        } else if (this.aircal.selectedStartDate && !this.aircal.selectedEndDate) {
            this.aircal.selectedEndDate = date;
        } else {
            //both are selected - is the date selected closer to the start or the end?          
            var diffFromStart = Math.abs(Math.round(moment.duration(moment(date).diff(this.aircal.selectedStartDate)).as("days"))),
                diffFromEnd = Math.abs(Math.round(moment.duration(moment(date).diff(this.aircal.selectedEndDate)).as("days")));

            if (diffFromStart >= diffFromEnd) {
                this.aircal.selectedEndDate = date;
            } else {
                this.aircal.selectedStartDate = date;
            };            
        };

        //Update the form
        if (this.aircal.selectedStartDate && this.aircal.selectedEndDate) {
            this.formSelectionText = `${this.formatDate(this.aircal.selectedStartDate)} - ${this.formatDate(this.aircal.selectedEndDate)}`;
        };

        //calculate number of days between start and end
        if (this.options.daysSelectedCounterVisible) {
            if (!this.aircal.selectedEndDate) return;
            let selectedDays = moment.duration(this.aircal.selectedEndDate.diff(this.aircal.selectedStartDate));
            this.aircal.numberOfDaysSelected.days = Math.round(selectedDays.asDays());
        };

        //Remove any highlighting
        this.removeRangeHighlighting();

        //Fire event
        this.dateRangeChanged();
    }

    public isSelected(date: any): boolean {
        if (!date) return false;

        if (!!this.aircal.selectedStartDate && !!this.aircal.selectedEndDate) {
            return this.aircal.selectedStartDate.isSameOrBefore(date) && this.aircal.selectedEndDate.isSameOrAfter(date);
        };

        if (this.aircal.selectedStartDate) {
            return this.aircal.selectedStartDate.isSame(date);
        }
    }

    //Subscriptions/Event emitters
    public dateRangeCommitted(): AircalResponse {
        const model = new AircalResponse(
            this.aircal.selectedStartDate,
            this.aircal.selectedEndDate,
            moment(this.aircal.selectedStartDate).format(this.options.dateFormat),
            moment(this.aircal.selectedEndDate).format(this.options.dateFormat),
        );

        this.onDateRangeCommitted.next(
            model
        );

        return model;
    }

    public dateRangeChanged(): AircalResponse {
        const model = new AircalResponse(
            this.aircal.selectedStartDate,
            this.aircal.selectedEndDate,
            moment(this.aircal.selectedStartDate).format(this.options.dateFormat),
            moment(this.aircal.selectedEndDate).format(this.options.dateFormat),
        );

        this.onDateRangeChanged.next(
            model
        );

        return model;
    }

    public inputFieldChanged(): AircalFormResponse {
        const model = new AircalFormResponse(
            this.aircal.selectedStartDate,
            this.aircal.selectedEndDate,
            moment(this.aircal.selectedStartDate).format(this.options.dateFormat),
            moment(this.aircal.selectedEndDate).format(this.options.dateFormat),
            true
        );

        this.onInputFieldChanged.next(
            model
        );

        return model;
    }

    public calendarViewChanged() {
        this.onCalendarViewChanged.next();
    }

    public dateRangeCleared(): AircalFormResponse {
        const freshModel = new AircalModel(),
            model = new AircalFormResponse(
                this.aircal.selectedStartDate,
                this.aircal.selectedEndDate,
                moment(this.aircal.selectedStartDate).format(this.options.dateFormat),
                moment(this.aircal.selectedEndDate).format(this.options.dateFormat),
                true
            );

        this.onDateRangeCleared.next(
            new AircalFormResponse(
                this.aircal.selectedStartDate,
                this.aircal.selectedEndDate,
                moment(this.aircal.selectedStartDate).format(this.options.dateFormat),
                moment(this.aircal.selectedEndDate).format(this.options.dateFormat),
                true
            )
        );

        this.aircal.selectedStartDate = freshModel.selectedStartDate;
        this.aircal.selectedEndDate = freshModel.selectedEndDate;
        this.aircal.numberOfDaysSelected.days = freshModel.numberOfDaysSelected.days;
        this.formSelectionText = "";
        this.invalidDateRange = false;

        return model;
    }

}