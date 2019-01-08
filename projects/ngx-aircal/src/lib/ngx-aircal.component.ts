import { Component, Input, OnInit, Output, OnDestroy, forwardRef, OnChanges, ViewEncapsulation, SimpleChanges } from "@angular/core";
import { Subject } from "rxjs";
import { parse, addMonths, addDays, startOfMonth, getDaysInMonth, subDays, format, subMonths, getYear, differenceInDays, isSameDay, startOfWeek, getDay, isValid, addYears, setMonth, getMonth, setYear, toDate } from "date-fns";

import { AircalOptions, AircalResponse, VISIBLE_YEAR_CHUNKS_AT_A_TIME, AIRCAL_CALENDAR_SPACES, AIRCAL_DAYS_IN_WEEK, AIRCAL_CALENDAR_SHORTCUT_SEPARATOR, AircalModel, AircalSelectedTime, AircalUtils, AIRCAL_CALENDAR_FORMAT_SEPARATOR, DateDisplayModel } from "./ngx-aircal.model";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

export const AIRCAL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxAircalComponent),
    multi: true
};

@Component({
    selector: "[data-ngx-aircal]",
    templateUrl: "./ngx-aircal.component.html",
    styleUrls: ["./style/_style.scss"],
    providers: [AIRCAL_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None
})
export class NgxAircalComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
    //Props
    public date: Date | any = new Date();
    public nextMonthDate: Date = addMonths(new Date(), 1);

    public daysWeeksArray: Array<Array<DateDisplayModel>> = [];
    public daysArray: Array<DateDisplayModel> = [];

    public nextMonthDaysWeeksArray: Array<Array<DateDisplayModel>> = [];
    public nextMonthDaysArray: Array<DateDisplayModel> = [];

    public allDaysArray: Array<DateDisplayModel> = [];
    public calendarSpaces: number = AIRCAL_CALENDAR_SPACES;
    public invalidDateRange: boolean = false;
    public showCalendar: boolean = false;
    public needsApplying: boolean = false;

    public yearSelectionPanelOpen: boolean = false;
    public yearChoices: Array<number> = [];

    public monthSelectionPanelOpen: boolean = false;
    public monthChoices: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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
        if(value && value.options && !value.options.firstChange) {
            this.intialiseCalendar();
        };
    }

    private intialiseCalendar(): void {
        //Initialise start and end date from options is valid
        if ( (this.options.startDate && isValid(this.options.startDate))) {
            let date = this.options.startDate
            let dispModel = new DateDisplayModel({
                day: date
            });
            this.selectDate(dispModel);
        };

        if ((this.options.endDate && isValid(this.options.endDate))) {
            let date = this.options.endDate;
            let dispModel = new DateDisplayModel({
                day: date
            });
            this.selectDate(dispModel, true);
        };

        if (this.options.defaultStart && isValid(this.options.defaultStart)) {
            this.date = this.options.defaultStart;
            this.nextMonthDate = addMonths(this.date, 1);
        };

        if (!this.canSelectPreviousMonth()) {
            this.aircal.disablePreviousSelection = true;
        };

        if (!this.canSelectNextMonth()) {
            this.aircal.disableForwardSelection = true;
        };

        this.createCalendars();
    }

    /**
     * Calendar functions
     */
    private createCalendars(): void {
        //Ensure this.date and this.nextMonthDate are calculated and set beforehand
        const cur = this.createAircal(this.date),
            nxt = this.createAircal(this.nextMonthDate);

        this.daysWeeksArray = cur.chunk;
        if(!this.options.singlePicker) {
            this.nextMonthDaysWeeksArray = nxt.chunk;
        };

        //Spread so highlights can be calculated
        this.allDaysArray = !this.options.singlePicker ? cur.spread.concat(nxt.spread) : cur.spread;
    }

    public createAircal(date: Date): { spread: Array<DateDisplayModel>, chunk: Array<Array<DateDisplayModel>> } {
        const currentMonth = startOfMonth(date),
            weekday = getDay(startOfMonth(currentMonth)),
            days = Array.from(new Array(getDaysInMonth(currentMonth)).keys());
        
        let previousWraparoundIterator = 1,
            nextWraparoundIterator = 0;

        let calendarDays = days.map((day: any) => {
            let newDayModel = new DateDisplayModel({
                day: addDays(currentMonth, day)
            });

            //Check for disabled dates
            if (!!this.options.disableFromHereBackwards && isValid(this.options.disableFromHereBackwards)) {
                if (newDayModel.day < this.options.disableFromHereBackwards) {
                    newDayModel.disabled = true;
                };
            };
            
            if (!!this.options.disableFromHereForwards && isValid(this.options.disableFromHereForwards)) {
                if (newDayModel.day > this.options.disableFromHereForwards) {
                    newDayModel.disabled = true;
                };
            };
            return newDayModel;
        });

        //Do wraparound dates
        while (previousWraparoundIterator < weekday) {
            let previousWrapArounddateObj = null;

            if (this.options.previousMonthWrapAround) {
                previousWrapArounddateObj = new DateDisplayModel({
                    day: subDays(startOfMonth(date), previousWraparoundIterator),
                    isLastMonth: true
                });
            };
            calendarDays.unshift(previousWrapArounddateObj);
            previousWraparoundIterator = previousWraparoundIterator + 1;
        };

        //See if there is any space left for next months wraparound
        while (calendarDays.length < this.calendarSpaces) {
            let nextWrapArounddateObj = null;
            if (this.options.nextMonthWrapAround) {
                nextWrapArounddateObj = new DateDisplayModel({
                    day: addDays(startOfMonth(addMonths(date, 1)), nextWraparoundIterator),
                    isNextMonth: true
                });
            };
            nextWraparoundIterator = nextWraparoundIterator + 1;
            calendarDays.push(nextWrapArounddateObj);
        };

        //Chunk the result into an array [7, 7, 7...] so it fits the table rows
        return {
            spread: calendarDays,
            chunk: this.chunk(calendarDays, AIRCAL_DAYS_IN_WEEK)
        };
    }

    /**
     * Helpers
     */
    public chunk(arr: Array<any>, chunkSize: number): Array<Array<DateDisplayModel>> {
        //Create a chunk array helper function so the display model can be output in table rows
        var chunk = [];
        for (var i = 0, len = arr.length; i < len; i += chunkSize) {
            chunk.push(arr.slice(i, i + chunkSize));
        };
        return chunk;
    }

    public getDynamicPlaceholderText(): string {
        const exampleDateRange = `e.g. ${this.formatDate(new Date())} - ${this.formatDate(addDays(new Date(), 5))}`;
        return this.options.includeExamplePlaceholder ? exampleDateRange : "Select Date";
    }

    public getCalendarOrientation(): string {
        return this.options.calendarPosition;
    }

    public getArrowBiasClass(): string {
        return this.options.hasArrow && this.options.arrowBias;
    }

    public prevYearChunks(load?: boolean) {
        this.yearChoices = this.loadYearChunk(this.yearChoices.pop() - 20);
    }
   
    public nextYearChunks(load?: boolean) {
        this.yearChoices = this.loadYearChunk(this.yearChoices.pop());
    }
    
    public toggleYearSelection() {
        this.monthSelectionPanelOpen = false;
        this.yearSelectionPanelOpen = !this.yearSelectionPanelOpen;
        if (this.yearSelectionPanelOpen) {
            this.yearChoices.length = 0;
            this.yearChoices = this.loadYearChunk(getYear(this.date));
            return;
        };
        this.yearChoices.length = 0;
    }
    
    public toggleMonthSelection() {
        this.yearSelectionPanelOpen = false;
        this.monthSelectionPanelOpen = !this.monthSelectionPanelOpen;
    }

    public selectMonth(month: number) {
        if (getMonth(this.date) === month) {
            return;
        };
        this.date = setMonth(this.date, month);
        this.nextMonthDate = setMonth(this.date, month+1);
        this.createCalendars();
    }
    
    public selectYear(year: number): void {
        if(getYear(this.date) === year) {
            return;
        };
        this.toggleYearSelection();
        this.date = setYear(this.date, year);
        this.nextMonthDate = addMonths(this.date, 1);
        this.createCalendars();
    }

    private loadYearChunk(from: number): Array<number> {
        let arr = [];
        for (let i = 0; i < VISIBLE_YEAR_CHUNKS_AT_A_TIME; i++) {
            arr.push(from+i);
        };
        return arr;
    }

    public openCalendar(): boolean {
        this.showCalendar = !this.showCalendar;
        return this.showCalendar;
    }

    public formatDate(date: DateDisplayModel | Date, formatStr?: string): string {
        date instanceof DateDisplayModel ? date = date.day : date;
        return format(date, formatStr || this.options.dateFormat, { awareOfUnicodeTokens: true });
    }

    public isToday(date: DateDisplayModel): boolean {
        if (!date || !date.day || !this.options.highlightToday) return false;
        return isSameDay(new Date(), date.day);
    }

    private removeRangeHighlighting(): Array<DateDisplayModel> {
        for (let date of this.allDaysArray) {
            if(date) {
                date.highlight = false;
                date = date;
            };
        };
        return this.allDaysArray;
    }

    public isHovering(cell: DateDisplayModel): Array<DateDisplayModel> {
        if (
            (!cell || this.aircal.selectedStartDate.day && this.aircal.selectedEndDate.day) ||
            (!this.aircal.selectedStartDate.day && this.aircal.selectedEndDate.day) ||
            (!this.aircal.selectedStartDate.day && !this.aircal.selectedEndDate.day)
        ) return;

        for (let date of this.allDaysArray) {
            if (date &&
                AircalUtils.isWithinRange(date.day, cell.day, this.aircal.selectedStartDate.day)
            ) {
                date.highlight = true;
                date = date;
            };
        };

        return this.allDaysArray;
    }

    public isLeaving(cell: DateDisplayModel): Array<DateDisplayModel> {
        if (!cell) return;

        for (let date of this.allDaysArray) {
            if (date &&
                AircalUtils.isWithinRange(date.day, cell.day, this.aircal.selectedStartDate.day)
            ) {
                date.highlight = false;
                date = date;
            };
        };

        return this.allDaysArray;
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
    public selectDate(date: DateDisplayModel, forceCommit: boolean = false, isShortcutSelection: boolean = false): void {
        if (!date || date.isLastMonth || date.isNextMonth) return;

        if (!this.aircal.selectedStartDate.day) {
            this.aircal.selectedStartDate = date;
        } else if (this.aircal.selectedStartDate.day && !this.aircal.selectedEndDate.day) {
            this.aircal.selectedEndDate = date;
            this.needsApplying = true;
        } else {
            if(isShortcutSelection) {
                this.aircal.selectedEndDate = date;
            } else {
                //both are selected - is the date selected closer to the start or the end?          
                var diffFromStart = Math.abs(Math.round(
                    differenceInDays(date.day, this.aircal.selectedStartDate.day)
                    )),
                    diffFromEnd = Math.abs(Math.round(
                        differenceInDays(date.day, this.aircal.selectedEndDate.day)
                    ));

                //If we select one that is already selected and it's within one of eachother - we must select a 1 day range
                if ((diffFromStart <= 1 && diffFromEnd <= 0) || (diffFromStart <= 0 && diffFromEnd <= 1)) {
                    if (diffFromEnd === 0) {
                        this.aircal.selectedStartDate = date;
                    } else {
                        this.aircal.selectedEndDate = date;
                    };
                } else {
                    if (date.day > this.aircal.selectedStartDate.day && diffFromStart >= diffFromEnd) {
                        this.aircal.selectedEndDate = date
                    } else {
                        this.aircal.selectedStartDate = date;
                    };
                };
            };

            this.needsApplying = true;
        };

        //calculate number of days between start and end
        if (this.options.daysSelectedCounterVisible) {
            if (!this.aircal.selectedEndDate.day) return;
            let selectedDays = differenceInDays(this.aircal.selectedEndDate.day, this.aircal.selectedStartDate.day);
            this.aircal.numberOfDaysSelected.days = Math.ceil(selectedDays) + 1;
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

    public selectionShortcutChanged(shortcut: string): string {
        if (!this.aircal.selectedStartDate.day) return;

        //Get the amount of time to be selected
        const timeMeasurement = AircalUtils.getShortcutStrucutre(shortcut),
            addUnits = AircalUtils.getAddType(timeMeasurement.unit),
            newSelectedEndDate = addUnits(this.aircal.selectedStartDate.day, timeMeasurement.time);

        //Set the end date
        if (getYear(newSelectedEndDate) < this.options.maxYear) {
            this.selectDate(
                new DateDisplayModel({
                    day: newSelectedEndDate
                }), false, true
            );
        };

        return shortcut;
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

    public isSelected(date: DateDisplayModel): boolean {
        if (!date || !date.day) return false;

        if (!!this.aircal.selectedStartDate.day && !!this.aircal.selectedEndDate.day) {
            return AircalUtils.isSameOrBefore(this.aircal.selectedStartDate.day, date.day) && AircalUtils.isSameOrAfter(this.aircal.selectedEndDate.day, date.day);
        };

        if (this.aircal.selectedStartDate) {
            return AircalUtils.isSame(this.aircal.selectedStartDate.day, date.day);
        };
    }

    private updateFormSelectionText(): string {
        //Update the form
        if (this.aircal.selectedStartDate && this.aircal.selectedEndDate) {
            this.formSelectionText = AircalUtils.getSelectionText(this.formatDate(this.aircal.selectedStartDate.day), this.formatDate(this.aircal.selectedEndDate.day));
        };

        return this.formSelectionText;
    }

    //Subscriptions/Event emitters
    public _dateRangeCommitted(): AircalResponse {
        const model = new AircalResponse(
            this.aircal.selectedStartDate.day,
            this.aircal.selectedEndDate.day,
            format(this.aircal.selectedStartDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true }),
            format(this.aircal.selectedEndDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true }),
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
            this.aircal.selectedStartDate.day,
            this.aircal.selectedEndDate.day,
            format(this.aircal.selectedStartDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true }),
            format(this.aircal.selectedEndDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true }),
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
            this.aircal.selectedStartDate.day,
            this.aircal.selectedEndDate.day,
            format(this.aircal.selectedStartDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true }),
            format(this.aircal.selectedEndDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true }),
        );

        this.onDateRangeChanged.next(
            model
        );

        return model;
    }

    public _inputFieldChanged(): AircalResponse {
        const model = new AircalResponse(
            this.aircal.selectedStartDate.day,
            this.aircal.selectedEndDate.day,
            format(this.aircal.selectedStartDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true }),
            format(this.aircal.selectedEndDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true })
        );

        this.onInputFieldChanged.next(
            model
        );

        return model;
    }

    public _calendarViewChanged(): void {
        this.onCalendarViewChanged.next();
    }

    public _dateRangeCleared(): AircalResponse {
        const freshModel = new AircalModel(),
            model = new AircalResponse(
                this.aircal.selectedStartDate.day,
                this.aircal.selectedEndDate.day,
                format(this.aircal.selectedStartDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true }),
                format(this.aircal.selectedEndDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true })
            );

        this.onDateRangeCleared.next(
            new AircalResponse(
                this.aircal.selectedStartDate.day,
                this.aircal.selectedEndDate.day,
                format(this.aircal.selectedStartDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true }),
                format(this.aircal.selectedEndDate.day, this.options.dateFormat, { awareOfUnicodeTokens: true })
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
    public writeValue(value: { startDate?: Date, endDate?: Date }): void {
        //Called after onInit
        //The initial form value passed from the parent must be written in here...
        if (value && value.startDate && value.endDate) {
            let start: Date = value.startDate,
                end: Date = value.endDate;

            if (isValid(start) && isValid(end)) {
                this.invalidDateRange = false;
                this.aircal.selectedStartDate.day = value.startDate;
                this.aircal.selectedEndDate.day = value.endDate;

                this.updateFormSelectionText();

                //calculate number of days between start and end
                if (this.options.daysSelectedCounterVisible) {
                    let selectedDays = differenceInDays(this.aircal.selectedEndDate.day, this.aircal.selectedStartDate.day);
                    this.aircal.numberOfDaysSelected.days = Math.ceil(selectedDays) + 1;
                };

                this._dateRangeInitialised();
                this._dateRangeCommitted();
            } else {
                this.invalidDateRange = true;
                return;
            };
        } else if (value === null || value === "") {
            //Ensure range is clear if we had at least a day selected
            if(this.aircal.selectedStartDate.day) {
                this._dateRangeCleared();
            };
        };
    }

    public onUserDateRangeInput(value: string) {
        //When the form has a date manually entered, this fires...
        if (value.length === 0) {
            this._inputFieldChanged();
            this._dateRangeCleared();
        } else {
            //Parse the string to a proper format, validate and assign if needed...
            //Return a model if valid, otherwise false
            const isDateValid = AircalUtils.getAndValidateModel(
                value
            );
            
            if (!isDateValid) {
                if (this.options.indicateInvalidDateRange) {
                    this.invalidDateRange = true;
                };
                this.onChangeCb(null);
                return;
            };

            //Date is valid so is safe to parse
            const model: { start: Date, end: Date } = AircalUtils.stringToStartAndEnd(value, this.options.dateFormat);

            if(!model) {
                return;
            };

            const {start, end} = model,
                datesViableGivenOpts = AircalUtils.isViableGivenOptions(
                    start,
                    end,
                    this.options.minYear,
                    this.options.maxYear,
                    this.options.disableFromHereBackwards,
                    this.options.disableFromHereForwards
                );

            if (!datesViableGivenOpts) {
                //Indicate the invalid range if invalid
                if (this.options.indicateInvalidDateRange) {
                    this.invalidDateRange = true;
                };
                this.onChangeCb(null);
                return;
            };

            this.invalidDateRange = false;

            //parse to model and validate input
            this.aircal.selectedStartDate = new DateDisplayModel({
                day: start
            });
            this.aircal.selectedEndDate = new DateDisplayModel({
                day: end
            });
         
            this._inputFieldChanged();

            if (isValid(model.start) && isValid(model.end)) {
                if(this.aircal.selectedStartDate && this.aircal.selectedEndDate) {
                    // this._dateRangeCommitted();
                };
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