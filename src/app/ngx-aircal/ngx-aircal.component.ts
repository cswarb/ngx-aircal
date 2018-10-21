import { Component, Input, OnInit, Output, OnDestroy, forwardRef, OnChanges, ViewEncapsulation, SimpleChanges } from "@angular/core";
import { Subject } from "rxjs";
import { parse, addMonths, addDays, startOfMonth, getDaysInMonth, subDays, format, subMonths, getYear, differenceInDays, isToday, startOfWeek, getDay, isValid } from "date-fns";

import { AircalOptions, AircalResponse, AIRCAL_CALENDAR_SPACES, AIRCAL_CALENDAR_SHORTCUT_SEPARATOR, AircalModel, AircalSelectedTime, AircalDateModel, AircalUtils, AIRCAL_CALENDAR_FORMAT_SEPARATOR } from "./ngx-aircal.model";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

export const AIRCAL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxAircalComponent),
    multi: true
};

@Component({
    selector: "[data-ngx-aircal]",
    templateUrl: "./ngx-aircal.component.html",
    providers: [AIRCAL_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None
})
export class NgxAircalComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
    //Props
    public date: Date | any = parse(new Date());
    public nextMonthDate: Date | any = addMonths(parse(new Date()), 1);
    public daysArray: Array<Date | any> = [];
    public nextMonthDaysArray: Array<Date | any> = [];
    public allDaysArray: Array<Date | any> = [];
    public calendarSpaces: number = AIRCAL_CALENDAR_SPACES;
    public invalidDateRange: boolean = false;
    public showCalendar: boolean = false;
    public needsApplying: boolean = false;

    //Form
    private onChangeCb: (_: any) => void = () => { };
    private onTouchedCb: () => void = () => { };

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
    //When a date range is passed in, the user may want to have a consistent callback, so provide this immediately
    @Output() onDateRangeInitialised: Subject<any> = new Subject();

    constructor() {
        
    }

    ngOnDestroy() {
        this.onDateRangeCommitted.unsubscribe();
        this.onInputFieldChanged.unsubscribe();
        this.onCalendarViewChanged.unsubscribe();
        this.onDateRangeCleared.unsubscribe();
        this.onDateRangeChanged.unsubscribe();
        this.onDateRangeInitialised.unsubscribe();        
    }

    ngOnInit() {
        this.intialiseCalendar();        
    }

    ngOnChanges(value: SimpleChanges) {
        //When options values change from outside the component, this fires...
        //Check for first change as this will fire the initialise cal function both here and onInit
        if(value.options && !value.options.firstChange) {
            this.intialiseCalendar();
        };
    }

    private intialiseCalendar(): void {
        //Initialise start and end date from options is valid
        if (this.options.startDate.isPopulated() && this.options.startDate.isViable()) {
            let date = parse(
                this.options.startDate.toDateFriendlyDateString()
            );
            this.selectDate(date);
        };

        if (this.options.endDate.isPopulated() && this.options.endDate.isViable()) {
            let date = parse(
                this.options.endDate.toDateFriendlyDateString()
            );
            this.selectDate(date, true);
        };

        if (this.options.defaultStart.isViable(true)) {
            this.date = parse(
                this.options.defaultStart.toDateFriendlyDateString()
            );
            this.nextMonthDate = addMonths(parse(this.date), 1);
        };

        this.createCalendars();
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

    public createAircal(date: Date): Array<any> {
        const currentMonth = startOfMonth(date),
            nextMonth = addMonths(currentMonth, 1),
            days = Array.from(new Array(getDaysInMonth(currentMonth)).keys());

        let calendarDays = days.map((day: any) => {
            let newDay = addDays(currentMonth, day);

            //Check for disabled dates
            if (this.options.disableFromHereBackwards || this.options.disableFromHereForwards) {
                const fromHereBackwards = parse(this.options.disableFromHereBackwards.toDateFriendlyDateString()),
                    fromHereForwards = parse(this.options.disableFromHereForwards.toDateFriendlyDateString());
                    
                if (newDay < fromHereBackwards || newDay > fromHereForwards) {
                    newDay["disabled"] = true;
                };
            };

            return newDay;
        });
        
        //Get the day number
        const weekday = getDay(startOfMonth(currentMonth));        
        
        //Pull in the previous months values to fill in the empty space
        for (let i = 1; i < weekday; i++) {
            let previousWrapArounddateObj = null;

            if (this.options.previousMonthWrapAround) {
                previousWrapArounddateObj = subDays(startOfMonth(date), i);
                previousWrapArounddateObj["isLastMonth"] = true;
            };

            calendarDays.unshift(previousWrapArounddateObj);
        };

        //See if there is any space left for next months wraparound
        let iterator = 0;
        while (calendarDays.length < this.calendarSpaces) {
            let nextWrapArounddateObj = null;
            
            if (this.options.nextMonthWrapAround) {
                nextWrapArounddateObj = addDays(startOfMonth(addMonths(date, 1)), iterator);
                nextWrapArounddateObj["isNextMonth"] = true;
            };

            iterator = iterator + 1;
            calendarDays.push(nextWrapArounddateObj);
        };

        return calendarDays;
    }

    /**
     * Helpers
     */
    public getCalendarOrientation(): string {
        return this.options.calendarPosition;
    }

    public getArrowBiasClass(): string {
        return this.options.hasArrow && this.options.arrowBias;
    }

    public openCalendar(): void {
        this.showCalendar = !this.showCalendar;
    }

    public formatDate(date: Date, formatStr?: string): any {
        return format(date, formatStr || this.options.dateFormat);
    }

    public isToday(date: Date): boolean {
        if (!date || !this.options.highlightToday) return false;
        return isToday(date);
    }

    private removeRangeHighlighting(): void {
        for (let date of this.allDaysArray) {
            date = date["highlight"] = false;
        };
    }

    public isHovering(cell: Date): void {
        if (
            (this.aircal.selectedStartDate && this.aircal.selectedEndDate) ||
            (!this.aircal.selectedStartDate && this.aircal.selectedEndDate) ||
            (!this.aircal.selectedStartDate && !this.aircal.selectedEndDate)
        ) return;

        for (let date of this.allDaysArray) {
            if (
                AircalUtils.isWithinRange(date, cell, this.aircal.selectedStartDate)
            ) {
                date = date["highlight"] = true;
            };
        };
    }

    public isLeaving(cell: Date): void {
        for (let date of this.allDaysArray) {
            if (
                AircalUtils.isWithinRange(date, cell, this.aircal.selectedStartDate)
            ) {
                date = date["highlight"] = false;
            };
        };
    }

    public canSelectPreviousMonth(): boolean {
        //See what year the user will be navigating to
        const goingToYear = getYear(subMonths(this.date, 1));

        //Compare to the minYear option
        return !!(goingToYear > this.options.minYear);
    }

    public canSelectNextMonth(): boolean {
        //See what year the user will be navigating to
        const goingToYear = getYear(addMonths(this.nextMonthDate, 1));

        //Compare to the minYear option
        return !!(goingToYear < this.options.maxYear);
    }

    /**
     * User Events
     */
    public selectDate(date: Date, forceCommit: boolean = false): void {
        if (!date || date["isLastMonth"] || date["isNextMonth"]) return;

        if (!this.aircal.selectedStartDate) {
            this.aircal.selectedStartDate = date;
        } else if (this.aircal.selectedStartDate && !this.aircal.selectedEndDate) {
            this.aircal.selectedEndDate = date;
            this.needsApplying = true;
        } else {
            //both are selected - is the date selected closer to the start or the end?          
            var diffFromStart = Math.abs(Math.round(
                    differenceInDays(date, this.aircal.selectedStartDate)
                )),
                diffFromEnd = Math.abs(Math.round(
                    differenceInDays(date, this.aircal.selectedEndDate)
                ));

            if (diffFromStart >= diffFromEnd) {
                this.aircal.selectedEndDate = date;
            } else {
                this.aircal.selectedStartDate = date;
            };

            this.needsApplying = true;
        };

        //calculate number of days between start and end
        if (this.options.daysSelectedCounterVisible) {
            if (!this.aircal.selectedEndDate) return;
            let selectedDays = differenceInDays(this.aircal.selectedEndDate, this.aircal.selectedStartDate);
            this.aircal.numberOfDaysSelected.days = Math.round(selectedDays);
        };

        //Remove any highlighting
        this.removeRangeHighlighting();

        //Fire event
        this._dateRangeChanged();

        if(this.aircal.selectedStartDate && this.aircal.selectedEndDate) {
            if(forceCommit || !this.options.showApplyBtn) {
                this._dateRangeCommitted();
            };
        };
    }

    public selectionShortcutChanged(shortcut: string): void {
        if (!this.aircal.selectedStartDate) return;

        //Get the amount of time to be selected
        const timeMeasurement = AircalUtils.getShortcutStrucutre(shortcut),
            addUnits = AircalUtils.getAddType(timeMeasurement.unit),
            newSelectedEndDate = addUnits(this.aircal.selectedStartDate, timeMeasurement.time);

        //Set the end date
        if (getYear(newSelectedEndDate) < this.options.maxYear) {
            this.selectDateShortcut(newSelectedEndDate);
        };
    }

    public prevMonth(): void {
        if (this.canSelectPreviousMonth()) {
            this.date = subMonths(this.date, 1);
            this.nextMonthDate = addMonths(this.date, 1);
            this.createCalendars();
            this._calendarViewChanged();
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
            this.date = addMonths(this.date, 1);
            this.nextMonthDate = addMonths(this.date, 1);
            this.createCalendars();
            this._calendarViewChanged();
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

    private selectDateShortcut(newEndDate: Date) {        
        this.aircal.selectedEndDate = newEndDate;

        //calculate number of days between start and end
        if (this.options.daysSelectedCounterVisible) {
            if (!this.aircal.selectedEndDate) return;
            let selectedDays = differenceInDays(this.aircal.selectedEndDate, this.aircal.selectedStartDate);
            this.aircal.numberOfDaysSelected.days = Math.round(selectedDays);
        };

        this.needsApplying = true;

        //Fire event
        this._dateRangeChanged();
    }

    public isSelected(date: Date): boolean {
        if (!date) return false;

        if (!!this.aircal.selectedStartDate && !!this.aircal.selectedEndDate) {
            return AircalUtils.isSameOrBefore(this.aircal.selectedStartDate, date) && AircalUtils.isSameOrAfter(this.aircal.selectedEndDate, date);
        };

        if (this.aircal.selectedStartDate) {
            return AircalUtils.isSame(this.aircal.selectedStartDate, date);
        };
    }

    private updateFormSelectionText() {
        //Update the form
        if (this.aircal.selectedStartDate && this.aircal.selectedEndDate) {
            this.formSelectionText = AircalUtils.getSelectionText(this.formatDate(this.aircal.selectedStartDate), this.formatDate(this.aircal.selectedEndDate));
        };
    }

    //Subscriptions/Event emitters
    public _dateRangeCommitted(): AircalResponse {
        const model = new AircalResponse(
            this.aircal.selectedStartDate,
            this.aircal.selectedEndDate,
            format(this.aircal.selectedStartDate, this.options.dateFormat),
            format(this.aircal.selectedEndDate, this.options.dateFormat),
        );

        this.onDateRangeCommitted.next(
            model
        );

        //Update form to committed values
        this.updateFormSelectionText();

        //Update form model
        this.onChangeCb(
            model
        );

        this.needsApplying = false;

        return model;
    }
    
    public _dateRangeInitialised(): AircalResponse {
        const model = new AircalResponse(
            this.aircal.selectedStartDate,
            this.aircal.selectedEndDate,
            format(this.aircal.selectedStartDate, this.options.dateFormat),
            format(this.aircal.selectedEndDate, this.options.dateFormat),
        );

        this.onDateRangeInitialised.next(
            model
        );

        //Update form model
        this.onChangeCb(
            model
        );

        return model;
    }

    public _dateRangeChanged(): AircalResponse {
        const model = new AircalResponse(
            this.aircal.selectedStartDate,
            this.aircal.selectedEndDate,
            format(this.aircal.selectedStartDate, this.options.dateFormat),
            format(this.aircal.selectedEndDate, this.options.dateFormat),
        );

        this.onDateRangeChanged.next(
            model
        );

        return model;
    }

    public _inputFieldChanged(): AircalResponse {
        const model = new AircalResponse(
            this.aircal.selectedStartDate,
            this.aircal.selectedEndDate,
            format(this.aircal.selectedStartDate, this.options.dateFormat),
            format(this.aircal.selectedEndDate, this.options.dateFormat)
        );

        this.onInputFieldChanged.next(
            model
        );

        return model;
    }

    public _calendarViewChanged() {
        this.onCalendarViewChanged.next();
    }

    public _dateRangeCleared(): AircalResponse {
        const freshModel = new AircalModel(),
            model = new AircalResponse(
                this.aircal.selectedStartDate,
                this.aircal.selectedEndDate,
                format(this.aircal.selectedStartDate, this.options.dateFormat),
                format(this.aircal.selectedEndDate, this.options.dateFormat)
            );

        this.onDateRangeCleared.next(
            new AircalResponse(
                this.aircal.selectedStartDate,
                this.aircal.selectedEndDate,
                format(this.aircal.selectedStartDate, this.options.dateFormat),
                format(this.aircal.selectedEndDate, this.options.dateFormat)
            )
        );

        this.aircal.selectedStartDate = freshModel.selectedStartDate;
        this.aircal.selectedEndDate = freshModel.selectedEndDate;
        this.aircal.numberOfDaysSelected.days = freshModel.numberOfDaysSelected.days;
        this.formSelectionText = "";
        this.invalidDateRange = false;

        this.onChangeCb(null);

        return model;
    }

    /**
     * Reactive form / ngModel / Options updates change detection
     */
    public writeValue(value: { startDate?: AircalDateModel, endDate?: AircalDateModel }): void {
        //Called after onInit
        //The initial form value passed from the parent must be written in here...
        if (value && value.startDate && value.endDate) {
            let start: Date = AircalDateModel.parseModelToDate(value.startDate),
                end: Date = AircalDateModel.parseModelToDate(value.endDate);

            if (isValid(start) && isValid(end)) {
                this.invalidDateRange = false;
                this.aircal.selectedStartDate = AircalDateModel.parseModelToDate(value.startDate);
                this.aircal.selectedEndDate = AircalDateModel.parseModelToDate(value.endDate);

                this.updateFormSelectionText();

                //calculate number of days between start and end
                if (this.options.daysSelectedCounterVisible) {
                    let selectedDays = differenceInDays(this.aircal.selectedEndDate, this.aircal.selectedStartDate);
                    this.aircal.numberOfDaysSelected.days = Math.round(selectedDays);
                };

                this._dateRangeInitialised();
                this._dateRangeCommitted();
            } else {
                this.invalidDateRange = true;
                return;
            };
        } else if (value === null || value === "") {
            //Ensure range is clear
            this._dateRangeCleared();
        };
    }

    public onUserDateRangeInput(value: string) {
        //When the form has a date manually entered, this fires...
        console.log("onUserDateRangeInput: ", value);

        if (value.length === 0) {
            this._inputFieldChanged();
            this._dateRangeCleared();
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

            //Parse the string to a proper format, validate and assign if needed...
            console.log(format(value, this.options.dateFormat));
            console.log(
                AircalUtils.isInputDateRangeValid(
                    value,
                    this.options.minYear,
                    this.options.maxYear,
                    this.options.disableFromHereBackwards,
                    this.options.disableFromHereForwards
                )
            );

            const model: { start: AircalDateModel, end: AircalDateModel } = AircalUtils.stringToStartAndEnd(value);

            let start = AircalDateModel.parseStringToDate(model.start.toDateFriendlyDateString()),
                end = AircalDateModel.parseStringToDate(model.end.toDateFriendlyDateString());
            
            //parse to model and validate input
            if(end > start) {
                if(isValid(start)) {
                    this.aircal.selectedStartDate = start;
                };
    
                if (isValid(end)) {
                    this.aircal.selectedEndDate = end;
                };
            } else {
                return;
            };

            this._inputFieldChanged();

            if(model.start.isViable() && model.end.isViable()) {
                if(this.aircal.selectedStartDate && this.aircal.selectedEndDate) {
                    this._dateRangeCommitted();
                };
            };
            
            //Indicate the invalid range if invalid
            if (this.options.indicateInvalidDateRange) {
                this.invalidDateRange = !isValid(start) && !isValid(end) || end < start;
            };
        }
    }

    public registerOnChange(fn: any): void {
        this.onChangeCb = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouchedCb = fn;
    }

}