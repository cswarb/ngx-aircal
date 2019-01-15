import { addDays, addMonths, addYears, isSameMonth, isSameYear, isSameDay, isAfter, isBefore, isEqual, parse, isValid, getYear, format, setMonth, getMonth } from "date-fns";

export const AIRCAL_CALENDAR_SPACES = 35;
export const AIRCAL_DAYS_IN_WEEK = 7;
export const VISIBLE_YEAR_CHUNKS_AT_A_TIME = 11;
export const AIRCAL_CALENDAR_SHORTCUT_SEPARATOR = ".";
export const AIRCAL_CALENDAR_FORMAT_SEPARATOR = " - ";

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
    public inlineMode: boolean = false;
    public disable: boolean = false;
    public singlePicker: boolean = false;
    public startDate?: Date = null;
    public endDate?: Date = null;
    public dayLabels: AircalDayLabels = new AircalDayLabels();
    public selectionShortcuts?: any = {"7.days": "7 Days", "14.days": "14 Days", "1.months": "1 Month", "6.months": "6 Months", "1.years": "1 Year"};
    public dateFormat?: string = "DD/MM/YYYY";
    public previousMonthWrapAround?: boolean = true;
    public nextMonthWrapAround?: boolean = true;
    public daysSelectedCounterVisible?: boolean = true;
    public selectionShortcutVisible?: boolean = false;
    public backgroundVisible?: boolean = true;
    public width?: string;
    public height?: string;
    public applyText?: string = "Apply";
    public includeExamplePlaceholder?: boolean = true;
    public clearText?: string = "Clear";
    // public selectDateText?: string = "Select date";
    // public selectDateCloseText?: string = "Close";
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
    public allowQuicksetMonth?: boolean = false;
    public allowQuicksetYear?: boolean = false;
    public icons?: { leftArrow?: null | string, rightArrow?: null | string } = {
        leftArrow: null,
        rightArrow: null
    };

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

    public static getMonthStr(date: string, format: string, separator: string): number {
        //escape the sep character
        separator = `\\${separator}`;

        //get the month and remove the seps. Find the index and substr to get the month number
        let monthFormatter = format.replace(/[dy]/gi, "").replace(new RegExp(separator, "g"), "");
        return parseInt(date.substr(format.indexOf(monthFormatter), monthFormatter.length));
    }
    
    public static getDayStr(date: string, format: string, separator: string): number {
        //escape the sep character
        separator = `\\${separator}`;

        //get the month and remove the seps. Find the index and substr to get the month number
        let monthFormatter = format.replace(/[my]/gi, "").replace(new RegExp(separator, "g"), "");
        return parseInt(date.substr(format.indexOf(monthFormatter), monthFormatter.length));
    }

    public static getAndValidateModel(dateRangeStr: string, dateFormat: string): boolean {
        //Make sure it is within valid and selectable range
        let isDateValid = false;

        try {
            //Within a reasonable range?
            if (dateRangeStr.length < 21 || dateRangeStr.length > 25) return isDateValid;

            let dates: Array<string> = dateRangeStr.split(AIRCAL_CALENDAR_FORMAT_SEPARATOR);

            //Have 2 separated dates?
            if (dates.length !== 2) {
                isDateValid = false;
            };

            //we may have something to parse, continue
            dates.forEach((date: string) => {
                date = date.trim();
                const separator = dateFormat.replace(/[dmy]/gi, "")[0];
                const d = date.trim().split(separator);

                //what is the month value
                const month: number = AircalUtils.getMonthStr(date, dateFormat, separator);
                const day: number = AircalUtils.getDayStr(date, dateFormat, separator);

                //3 parts to the date?
                if(d.length !== 3) {
                    isDateValid = false;
                };                

                isDateValid = isValid(new Date(parseInt(d[2]), month - 1, day));
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
        
        if ((disableFromHereBackwards && isAfter(endDate, disableFromHereForwards)) || disableFromHereForwards && (isBefore(startDate, disableFromHereBackwards))) {
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
    
    public static stringToStartAndEnd(startAndEnd: string, dateFormat: string): { start: Date, end: Date } {
        try {
            const separator = dateFormat.replace(/[dmy]/gi, "")[0],
                d = startAndEnd.split(AIRCAL_CALENDAR_FORMAT_SEPARATOR),
                startDate = d[0].trim().split(separator),
                endDate = d[1].trim().split(separator),
                startDateMonth = AircalUtils.getMonthStr(d[0].trim(), dateFormat, separator),
                startDateDay = AircalUtils.getDayStr(d[0].trim(), dateFormat, separator),
                endDateMonth = AircalUtils.getMonthStr(d[1].trim(), dateFormat, separator),
                endDateDay = AircalUtils.getDayStr(d[1].trim(), dateFormat, separator);

            return {
                start: new Date(
                    parseInt(startDate[2]),
                    startDateMonth-1,
                    startDateDay
                ),
                end: new Date(
                    parseInt(endDate[2]),
                    endDateMonth-1,
                    endDateDay
                )
            };
        } catch(e) {
            return null;
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