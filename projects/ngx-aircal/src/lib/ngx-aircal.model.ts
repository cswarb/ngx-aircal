import { addDays, addMonths, addYears, isSameMonth, isSameYear, isSameDay, isAfter, isBefore, isEqual, parse, isValid, getYear, format, setMonth, getMonth } from "date-fns";

export const AIRCAL_CALENDAR_SPACES = 35;
export const AIRCAL_DAYS_IN_WEEK = 7;
export const VISIBLE_YEAR_CHUNKS_AT_A_TIME = 11;
export const AIRCAL_CALENDAR_SHORTCUT_SEPARATOR = ".";
export const AIRCAL_CALENDAR_FORMAT_SEPARATOR = "-";

export class AircalModel {
    public selectedStartDate: DateDisplayModel = new DateDisplayModel();
    public selectedEndDate: DateDisplayModel = new DateDisplayModel();
    public numberOfDaysSelected: AircalSelectedTime = new AircalSelectedTime();
    public disableForwardSelection: boolean = false;
    public disablePreviousSelection: boolean = false;

    constructor(init?: Partial<AircalModel>) {
        Object.assign(this, init);
    }
}

export class AircalSelectedTime {
    days: number = 0;
    months?: number = 0;
    years?: number = 0;

    constructor(init?: Partial<AircalOptions>) {
        Object.assign(this, init);
    }
}

export class AircalDayLabels {
    public mo: string = "Mo";
    public tu: string = "Tu";
    public we: string = "We";
    public th: string = "Th";
    public fr: string = "Fr";
    public sa: string = "Sa";
    public su: string = "Su";

    constructor(init?: Partial<AircalDayLabels>) {
        Object.assign(this, init);
    }
}

export type arrowBias = "left" | "middle" | "right";
export type calendarBias = "left" | "top" | "right" | "bottom";

export class DateDisplayModel {
    public day: Date | null = null;
    public disabled: boolean = false;
    public isLastMonth: boolean = false;
    public isNextMonth: boolean = false;
    public highlight: boolean = false;

    constructor(init?: Partial<DateDisplayModel>) {
        Object.assign(this, init);
    }
}
export class AircalOptions {
    public defaultStart?: Date = new Date();
    public inlineMode: boolean = false; //Display the calendar without a form input @todo
    public startDate?: Date = null;
    public endDate?: Date = null;
    public dayLabels: AircalDayLabels = new AircalDayLabels();
    public selectionShortcuts?: any = {"7.days": "7 Days", "14.days": "14 Days", "1.months": "1 Month", "6.months": "6 Months", "1.years": "1 Year"};
    public dateFormat?: string = "DD/MM/YYYY";
    public previousMonthWrapAround?: boolean = true;
    public nextMonthWrapAround?: boolean = true;
    public daysSelectedCounterVisible?: boolean = true;
    public selectionShortcutVisible?: boolean = true;
    public backgroundVisible?: boolean = true;
    public width?: string;
    public height?: string;
    public applyText?: string = "Apply";
    public clearText?: string = "Clear";
    public selectDateText?: string = "Select date";
    public selectDateCloseText?: string = "Close";
    public highlightToday?: boolean = true;
    public showClearBtn?: boolean = true;
    public showApplyBtn?: boolean = true;
    public minYear?: number = 1000;
    public maxYear?: number = 9999;
    public disablePreviousSelection?: boolean = false;
    public disableForwardSelection?: boolean = false;
    public disableFromHereBackwards?: Date = null;
    public disableFromHereForwards?: Date = null;
    public indicateInvalidDateRange?: boolean = true;
    public hasArrow?: boolean = true;
    public arrowBias?: arrowBias = "left";
    public calendarPosition?: calendarBias = "bottom";
    // public monthSelector?: boolean = false; //@todo
    // public yearSelector?: boolean = false; //@todo

    constructor(init?: Partial<AircalOptions>) {
        Object.assign(this, init);
    }
}

export class AircalUtils {
    constructor() {

    }

    public static isCurrentYear(date: Date, year: number): boolean {
        return getYear(date) === year;
    }

    public static isCurrentMonth(date: Date, month: number): boolean {
        return getMonth(date) === month;
    }

    public static isSameOrBefore(leftDate: Date, rightDate: Date): boolean {
        return this.isSame(leftDate, rightDate) || isBefore(leftDate, rightDate);
    }
    
    public static isSameOrAfter(leftDate: Date, rightDate: Date): boolean {
        return this.isSame(leftDate, rightDate) || isAfter(leftDate, rightDate);
    }
    
    public static isSame(leftDate: Date, rightDate: Date): boolean {
        return isEqual(leftDate, rightDate);
    }

    public static formatMonthToReadable(month: number): string {
        return format(setMonth(new Date(), month), "MMMM");
    }

    public static getAddType(unit: string): any {
        let addType;
        switch (unit) {
            case "days":
                addType = addDays;
                break;
            case "months":
                addType = addMonths;
                break;
            case "years":
                addType = addYears;
                break;
            default:
                addType = addDays;
                break;
        };
        return addType;
    };

    public static getAndValidateModel(dateRangeStr: string): boolean {
        //Make sure it is within valid and selectable range
        let isDateValid = false;

        try {
            let dates: Array<string> = dateRangeStr.split("-");

            if (dates.length !== 2) {
                isDateValid = false;
            };

            //we may have something to parse, continue
            dates.forEach((date: string) => {
                let d = date.trim().split("/");
                
                if(d.length !== 3) {
                    isDateValid = false;
                };

                isDateValid = isValid(new Date(parseInt(d[2]), parseInt(d[1]), parseInt(d[0])));
            });
        } catch(e) {
            isDateValid = false;
        };
        
        return isDateValid;
    }

    public static isViableGivenOptions(startDate: Date, endDate: Date, minYear: number, maxYear: number, disableFromHereBackwards: Date, disableFromHereForwards: Date): boolean {
        if (isAfter(startDate, endDate) || endDate < startDate) {
            return false;
        };

        if (getYear(endDate) > maxYear || getYear(startDate) > maxYear) {
            return false;
        };
        
        if (getYear(endDate) < minYear || getYear(startDate) < minYear) {
            return false;
        };
        
        if (isAfter(endDate, disableFromHereForwards) || isBefore(startDate, disableFromHereBackwards)) {
            return false;
        };

        return true;
    }
    
    public static getShortcutStrucutre(shortcut: string): { time: string, unit: any } {
        const shortcutData = shortcut.split(AIRCAL_CALENDAR_SHORTCUT_SEPARATOR);
        return {
            time: shortcutData[0] || "1",
            unit: shortcutData[1] || "days"
        };
    }

    public static isWithinRange(date: Date, cell: Date, selectedStartDate: Date): boolean {
        return date > selectedStartDate && date <= cell;
    }

    public static parseStringToDate(selectedDate: string): Date {
        return parse(selectedDate);
    }

    public static getSelectionText(begin: string, end: string): string {
        return `${begin} ${AIRCAL_CALENDAR_FORMAT_SEPARATOR} ${end}`;
    }
    
    public static stringToStartAndEnd(startAndEnd: string): { start: Date, end: Date } {
        try {
            let d = startAndEnd.split(AIRCAL_CALENDAR_FORMAT_SEPARATOR),
                startDate = d[0].trim().split("/"),
                endDate = d[1].trim().split("/");

            return {
                start: new Date(
                    parseInt(startDate[2]),
                    parseInt(startDate[1]),
                    parseInt(startDate[0])
                ),
                end: new Date(
                    parseInt(endDate[2]),
                    parseInt(endDate[1]),
                    parseInt(endDate[0])
                )
            };
        } catch(e) {
            return;
        };
    }
}

//Reponses for Observables
export class AircalResponse {
    constructor(
        public startDate: Date,
        public endDate: Date,
        public formattedStartDate: string,
        public formattedEndDate: string
    ) {

    }
}