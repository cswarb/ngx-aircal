import { Component, Input, OnInit, Output, OnDestroy, forwardRef, OnChanges, ViewEncapsulation, SimpleChanges } from "@angular/core";
import { Subject } from "rxjs";
import { parse, addMonths, addDays, startOfMonth, getDaysInMonth, subDays, format, subMonths, getYear, differenceInDays, isToday, startOfWeek, getDay, isValid } from "date-fns";

import { AircalOptions, AircalResponse, AIRCAL_CALENDAR_SPACES, AIRCAL_CALENDAR_SHORTCUT_SEPARATOR, AircalModel, AircalSelectedTime, AircalDateModel, AircalUtils, AIRCAL_CALENDAR_FORMAT_SEPARATOR, DateDisplayModel } from "./ngx-aircal.model";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

export const AIRCAL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxAircalComponent),
    multi: true
};

@Component({
    selector: "[data-ngx-aircal]",
    template:'<div class="aircal__container"><div class="aircal__meta__input__container" *ngIf="!options?.inlineMode"><input type="text" class="aircal__meta__input" placeholder="Select Date" [ngModel]="formSelectionText" (ngModelChange)="onUserDateRangeInput($event)" [value]="formSelectionText" [disabled]="false" [readonly]="false" [ngClass]="{\'aircal__meta__input--invalid\': options?.indicateInvalidDateRange && invalidDateRange}" autocomplete="off" spellcheck="false" autocorrect="off"> <button type="button" class="aircal__meta__input__icon aircal__meta__input__icon--opening" [ngClass]="{\'aircal__meta__input__icon--opening\': !showCalendar, \'aircal__meta__input__icon--closing\': showCalendar}" (click)="openCalendar()">{{options?.selectDateText}}</button> <button type="button" class="aircal__meta__input__icon aircal__meta__input__icon--alt aircal__meta__input__icon--closing" [ngClass]="{\'aircal__meta__input__icon--opening\': showCalendar, \'aircal__meta__input__icon--closing\': !showCalendar}" (click)="openCalendar()">{{options?.selectDateCloseText}}</button></div><div class="aircal" [ngClass]="[\'aircal__orient--\' + getCalendarOrientation(), options?.hasArrow ? \'aircal--\' + getArrowBiasClass() + \'-bias\' : \'\', options?.hasArrow && !options?.inlineMode ? \'aircal--has-arrow\' : \'\', options?.inlineMode ? \'aircal--inline\' : \'\']" *ngIf="showCalendar || options?.inlineMode" [ngStyle]="{\'width\': options?.width, \'height\': options?.height}"><section class="aircal__meta aircal__meta__rows--first aircal__meta__rows"><div class="aircal__meta__row"><div *ngIf="options?.daysSelectedCounterVisible" data-aircal-daysselected [numberOfDaysSelected]="aircal?.numberOfDaysSelected"></div></div><div class="aircal__meta__column aircal__meta__row__shortcuts"><div *ngIf="options?.selectionShortcutVisible" data-aircal-select [selectedStartDate]="aircal?.selectedStartDate.day" [selectionShortcuts]="options?.selectionShortcuts" (selectionShortcutChanged)="selectionShortcutChanged($event)"></div></div></section><div class="aircal__cal__container"><div class="aircal__cal aircal__cal--double"><section class="aircal__meta"><button type="button" [disabled]="options?.disablePreviousSelection || aircal?.disablePreviousSelection" role="button" (click)="prevMonth()" class="aircal__icon aircal__icon__button aircal__icon__prev"></button><p class="aircal__text aircal__text__month">{{formatDate(date, "MMMM")}} {{formatDate(date, "YYYY")}}</p></section><div class="aircal__meta"><div aircal-aircal-daysofweek class="flex-container aircal__daysofweek" *ngFor="let dayName of ObjectKeys(options.dayLabels)" [dayName]="dayName" [dayLabels]="options?.dayLabels"></div></div><div class="aircal__day__container"><div data-aircal-day class="aircal__day" *ngFor="let day of daysArray" (mouseenter)="isHovering(day)" (mouseleave)="isLeaving(day)" (click)="selectDate(day)" [ngClass]="{\'aircal--inactive\': (!day || day?.disabled || day?.isLastMonth || day?.isNextMonth), \'aircal--highlighted\': day?.highlight, \'aircal--istoday\': isToday(day), \'aircal--selected\': isSelected(day) && (!day?.isNextMonth || !day?.isLastMonth)}" [day]="day"></div></div></div><div class="aircal__cal aircal__cal--double"><div class="aircal__meta"><p class="aircal__text aircal__text__month">{{formatDate(nextMonthDate, "MMMM")}} {{formatDate(nextMonthDate, "YYYY")}}</p><button type="button" [disabled]="options?.disableForwardSelection || aircal?.disableForwardSelection" role="button" (click)="nextMonth()" class="aircal__icon aircal__icon__button aircal__icon__next"></button></div><div class="aircal__meta"><div aircal-aircal-daysofweek class="flex-container aircal__daysofweek" *ngFor="let dayName of ObjectKeys(options.dayLabels)" [dayName]="dayName" [dayLabels]="options?.dayLabels"></div></div><div class="aircal__day__container"><div data-aircal-day class="aircal__day" *ngFor="let day of nextMonthDaysArray" (mouseenter)="isHovering(day)" (mouseleave)="isLeaving(day)" (click)="selectDate(day)" [ngClass]="{\'aircal--inactive\': (!day || day?.disabled || day?.isLastMonth || day?.isNextMonth), \'aircal--highlighted\': day?.highlight, \'aircal--istoday\': isToday(day), \'aircal--selected\': isSelected(day) && (!day?.isNextMonth || !day?.isLastMonth)}" [day]="day"></div></div></div></div><div class="aircal__actions aircal__meta__rows--last"><div><button *ngIf="options?.showClearBtn" type="button" class="aircal__button aircal__button--cancel" [disabled]="!(this.aircal.selectedStartDate?.day && this.aircal.selectedEndDate?.day)" (click)="_dateRangeCleared()">{{options?.clearText}}</button></div><div><button *ngIf="options?.showApplyBtn" type="button" [disabled]="!(this.aircal.selectedStartDate?.day && this.aircal.selectedEndDate?.day) || !needsApplying" class="aircal__button aircal__button--apply" (click)="_dateRangeCommitted()">{{options?.applyText}}</button></div></div></div></div>',
    styles: [`
      :host{display:inline-block}@keyframes slideInLeft{0%{right:-30%}100%{right:0%}}@keyframes slideOutRight{0%{right:0%}100%{right:-30%}}.aircal{max-width:650px;font-family:sans-serif;position:relative;overflow:auto;padding:2rem;display:flex;position:absolute;top:0;left:0;z-index:999;overflow:visible;background-color:#ffffff;justify-content:center;align-items:center;text-align:center;flex-flow:column;box-shadow:0px 0px 7px #eef0f3;border-radius:3px}.aircal *{box-sizing:border-box}.aircal--inline{position:relative}.aircal__orient--bottom{top:125%;left:0}.aircal__orient--top{top:-1290%;left:0}.aircal__orient--left{top:10%;left:-244%}.aircal__orient--right{top:-10%;left:105%}.aircal--has-arrow:after,.aircal--has-arrow:before{content:"";bottom:100%;left:50%;border:solid transparent;height:0;width:0;position:absolute;pointer-events:none}.aircal--has-arrow:before{border-color:rgba(194,225,245,0);border-bottom-color:#eef0f3;border-width:10px;margin-left:-10px}.aircal--has-arrow:after{border-color:rgba(136,183,213,0);border-bottom-color:#ffffff;border-width:9px;margin-left:-9px}.aircal--left-bias:after,.aircal--left-bias:before{content:"";left:10%}.aircal--right-bias:after,.aircal--right-bias:before{content:"";left:90%}.aircal__container{position:relative;width:auto;height:auto;display:inline-block}.aircal__cal{display:flex;flex-flow:column}.aircal__cal__container{display:flex;justify-content:center;align-items:center;text-align:center;align-items:flex-start}@media screen and (max-width: 700px){.aircal__cal__container{flex-flow:column nowrap}}.aircal__cal--double:first-child{margin-right:0.75rem}.aircal__cal--double:last-child{margin-left:0.75rem}@media screen and (max-width: 700px){.aircal__cal--double{flex-flow:column nowrap}.aircal__cal--double:first-child{margin-right:0;margin-bottom:2rem}.aircal__cal--double:last-child{margin-left:0}}.aircal__shortcut{font-size:0.8rem}.aircal__meta{display:flex;justify-content:space-between;align-items:center}.aircal__meta__input{font-size:0.8rem;letter-spacing:0.3px;color:grey;padding:0.5rem 0.5rem;border-radius:2px;border:1px solid #e4e7e7;min-width:17rem}.aircal__meta__input__icon{position:absolute;right:-30%;top:50%;transform:translateY(-50%) translateZ(0);margin-right:0.5rem;background-color:#00a699;outline:none;border:none;color:#06332f;padding:0.25rem;font-size:11px;border-radius:2px;width:4.5rem}.aircal__meta__input__icon:hover{cursor:pointer;background-color:#008d81}.aircal__meta__input__icon--alt{background-color:#ffdda6;color:#736247}.aircal__meta__input__icon--alt:hover{background-color:#ffd38d}.aircal__meta__input__icon--opening{animation:slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards}.aircal__meta__input__icon--closing{animation:slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards}.aircal__meta__input__container{position:relative;overflow:hidden}.aircal__meta__input--invalid{border-color:#f1a5a5}.aircal__meta__input--invalid:focus{outline-color:#f1a5a5}.aircal__meta--column{flex-flow:column nowrap}.aircal__meta__rows{width:100%;margin:1rem 0}.aircal__meta__rows--first{margin-top:0}.aircal__meta__rows--last{margin-bottom:0}.aircal__meta__row{display:flex}.aircal__meta__row__item{color:#cacccd;font-size:0.8rem;margin:0}.aircal__meta__row__item--highlight{color:#95a3b1}.aircal__text{color:#484848}.aircal__text__month{font-weight:700;margin:0;flex:1}.aircal__icon{background-size:1rem;background-repeat:no-repeat;background-position:center;width:1rem;height:1rem;opacity:0.7}.aircal__icon__next{background-image:url("https://image.flaticon.com/icons/svg/66/66831.svg")}.aircal__icon__prev{background-image:url("https://image.flaticon.com/icons/svg/109/109618.svg")}.aircal__icon:hover{cursor:pointer;opacity:0.5}.aircal__icon__button{border:0;outline:none;background-color:transparent}.aircal__icon__button:disabled{opacity:0.2}.aircal__icon__button:disabled:hover{opacity:0.2;cursor:not-allowed}.aircal__button{outline:none;border:0;margin:1rem 0;background:transparent;color:#484848;font-size:0.85rem;justify-content:space-between;align-content:space-between}.aircal__button:hover:not(:disabled){cursor:pointer;text-decoration:underline}.aircal__button:disabled{opacity:0.2}.aircal__button:disabled:hover{cursor:auto}.aircal__button--apply{color:#00a699;margin-bottom:0}.aircal__button--cancel{margin-bottom:0}.aircal__actions{display:flex;margin:1rem 0 0 0;justify-content:space-between;align-items:center;width:100%}.aircal__actions>button:not(:last-child){margin-right:1rem}.aircal__day{display:flex;justify-content:center;align-items:center;margin-top:-1px;margin-left:-1px;border:1px solid #e4e7e7;color:#484848;padding:0.25rem;font-size:0.8rem;width:2.5rem;height:2.5rem;text-align:center}.aircal__day__container{display:flex;flex-wrap:wrap;justify-content:flex-start}.aircal__day:hover{cursor:pointer;background-color:#e4e7e7}.aircal__day:hover.aircal--selected{background-color:#008d81}.aircal__day.aircal--inactive{opacity:0.3;pointer-events:none}.aircal__day.aircal--selected{background-color:#00a699;color:white;border-color:#00a699}.aircal__day.aircal--istoday:not(.aircal--selected){color:#007a87}.aircal__day.aircal--highlighted{background-color:#b2f1ec;color:#007a87;border-color:#80e8e0}.aircal__daysofweek{display:flex;justify-content:center;align-items:center;margin:0;color:#484848;padding:0.25rem;font-size:0.75rem;width:2.5rem;height:2.5rem;text-align:center}.aircal__helper--bold{font-weight:700}
    `],
    providers: [AIRCAL_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None
})
export class NgxAircalComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
    //Props
    public date: Date | any = parse(new Date());
    public nextMonthDate: Date = addMonths(parse(new Date()), 1);
    public daysArray: Array<DateDisplayModel> = [];
    public nextMonthDaysArray: Array<DateDisplayModel> = [];
    public allDaysArray: Array<DateDisplayModel> = [];
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
        if(value && value.options && !value.options.firstChange) {
            this.intialiseCalendar();
        };
    }

    private intialiseCalendar(): void {
        //Initialise start and end date from options is valid
        if (this.options.startDate.isPopulated() && this.options.startDate.isViable()) {
            let date = parse(
                this.options.startDate.toDateFriendlyDateString()
            );
            let dispModel = new DateDisplayModel({
                day: date
            });
            this.selectDate(dispModel);
        };

        if (this.options.endDate.isPopulated() && this.options.endDate.isViable()) {
            let date = parse(
                this.options.endDate.toDateFriendlyDateString()
            );
            let dispModel = new DateDisplayModel({
                day: date
            });
            this.selectDate(dispModel, true);
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

    public createAircal(date: Date): Array<DateDisplayModel> {
        const currentMonth = startOfMonth(date),
            nextMonth = addMonths(currentMonth, 1),
            weekday = getDay(startOfMonth(currentMonth)),
            days = Array.from(new Array(getDaysInMonth(currentMonth)).keys());
        
        let previousWraparoundIterator = 1,
            nextWraparoundIterator = 0;

        let calendarDays = days.map((day: any) => {
            let newDayModel = new DateDisplayModel({
                day: addDays(currentMonth, day)
            });

            //Check for disabled dates
            if (this.options.disableFromHereBackwards || this.options.disableFromHereForwards) {
                const fromHereBackwards = parse(this.options.disableFromHereBackwards.toDateFriendlyDateString()),
                    fromHereForwards = parse(this.options.disableFromHereForwards.toDateFriendlyDateString());
                    
                if (newDayModel.day < fromHereBackwards || newDayModel.day > fromHereForwards) {
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

    public openCalendar(): boolean {
        this.showCalendar = !this.showCalendar;
        return this.showCalendar;
    }

    public formatDate(date: DateDisplayModel | Date, formatStr?: string): string {
        date instanceof DateDisplayModel ? date = date.day : date;
        return format(date, formatStr || this.options.dateFormat);
    }

    public isToday(date: DateDisplayModel): boolean {
        if (!date.day || !this.options.highlightToday) return false;
        return isToday(date.day);
    }

    private removeRangeHighlighting(): Array<DateDisplayModel> {
        for (let date of this.allDaysArray) {
            date.highlight = false;
            date = date;
        };
        return this.allDaysArray;
    }

    public isHovering(cell: DateDisplayModel): Array<DateDisplayModel> {
        if (
            (this.aircal.selectedStartDate.day && this.aircal.selectedEndDate.day) ||
            (!this.aircal.selectedStartDate.day && this.aircal.selectedEndDate.day) ||
            (!this.aircal.selectedStartDate.day && !this.aircal.selectedEndDate.day)
        ) return;

        for (let date of this.allDaysArray) {
            if (
                AircalUtils.isWithinRange(date.day, cell.day, this.aircal.selectedStartDate.day)
            ) {
                date.highlight = true;
                date = date;
            };
        };

        return this.allDaysArray;
    }

    public isLeaving(cell: DateDisplayModel): Array<DateDisplayModel> {
        for (let date of this.allDaysArray) {
            if (
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
    
                if (diffFromStart >= diffFromEnd) {
                    this.aircal.selectedEndDate = date;
                } else {
                    this.aircal.selectedStartDate = date;
                };
            };

            this.needsApplying = true;
        };

        //calculate number of days between start and end
        if (this.options.daysSelectedCounterVisible) {
            if (!this.aircal.selectedEndDate.day) return;
            let selectedDays = differenceInDays(this.aircal.selectedEndDate.day, this.aircal.selectedStartDate.day);
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
        if (!date.day) return false;

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
            format(this.aircal.selectedStartDate.day, this.options.dateFormat),
            format(this.aircal.selectedEndDate.day, this.options.dateFormat),
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
            format(this.aircal.selectedStartDate.day, this.options.dateFormat),
            format(this.aircal.selectedEndDate.day, this.options.dateFormat),
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
            format(this.aircal.selectedStartDate.day, this.options.dateFormat),
            format(this.aircal.selectedEndDate.day, this.options.dateFormat),
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
            format(this.aircal.selectedStartDate.day, this.options.dateFormat),
            format(this.aircal.selectedEndDate.day, this.options.dateFormat)
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
                format(this.aircal.selectedStartDate.day, this.options.dateFormat),
                format(this.aircal.selectedEndDate.day, this.options.dateFormat)
            );

        this.onDateRangeCleared.next(
            new AircalResponse(
                this.aircal.selectedStartDate.day,
                this.aircal.selectedEndDate.day,
                format(this.aircal.selectedStartDate.day, this.options.dateFormat),
                format(this.aircal.selectedEndDate.day, this.options.dateFormat)
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
            let start: Date = AircalUtils.parseModelToDate(value.startDate),
                end: Date = AircalUtils.parseModelToDate(value.endDate);

            if (isValid(start) && isValid(end)) {
                this.invalidDateRange = false;
                this.aircal.selectedStartDate.day = AircalUtils.parseModelToDate(value.startDate);
                this.aircal.selectedEndDate.day = AircalUtils.parseModelToDate(value.endDate);

                this.updateFormSelectionText();

                //calculate number of days between start and end
                if (this.options.daysSelectedCounterVisible) {
                    let selectedDays = differenceInDays(this.aircal.selectedEndDate.day, this.aircal.selectedStartDate.day);
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

            const model: { start: AircalDateModel, end: AircalDateModel } = AircalUtils.stringToStartAndEnd(value);

            if(!model) {
                return;
            };

            let start = AircalUtils.parseStringToDate(model.start.toDateFriendlyDateString()),
                end = AircalUtils.parseStringToDate(model.end.toDateFriendlyDateString()),
                disableFromDate = AircalUtils.parseStringToDate(this.options.disableFromHereBackwards.toDateFriendlyDateString()),
                disableToDate = AircalUtils.parseStringToDate(this.options.disableFromHereForwards.toDateFriendlyDateString());

            const datesViableGivenOpts = AircalUtils.isViableGivenOptions(
                start,
                end,
                this.options.minYear,
                this.options.maxYear,
                disableFromDate,
                disableToDate
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
            this.aircal.selectedStartDate.day = start;
            this.aircal.selectedEndDate.day = end;
         
            this._inputFieldChanged();

            if(model.start.isViable() && model.end.isViable()) {
                if(this.aircal.selectedStartDate && this.aircal.selectedEndDate) {
                    this._dateRangeCommitted();
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