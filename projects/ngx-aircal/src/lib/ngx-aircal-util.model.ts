import { addDays, addMonths, addYears, isSameMonth, isSameYear, isSameDay, isAfter, isBefore, isEqual, parse, isValid, getYear, format, setMonth, getMonth } from "date-fns";
import { AircalDayLabels, arrowBias, calendarBias } from "./ngx-aircal.model";

export const AIRCAL_CALENDAR_SPACES = 35;
export const AIRCAL_DAYS_IN_WEEK = 7;
export const VISIBLE_YEAR_CHUNKS_AT_A_TIME = 11;
export const AIRCAL_CALENDAR_SHORTCUT_SEPARATOR = ".";
export const AIRCAL_CALENDAR_FORMAT_SEPARATOR = " - ";

const monthLabels: Array<string> = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
];

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
    public selectionShortcuts?: any = { "7.days": "7 Days", "14.days": "14 Days", "1.months": "1 Month", "6.months": "6 Months", "1.years": "1 Year" };
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

export class AircalHelpers {
    public static chunk(arr: Array<DateDisplayModel | null>, chunkSize: number): Array<Array<DateDisplayModel>> {
        //Create a chunk array helper function so the display model can be output in table rows
        var chunk = [];
        for (var i = 0, len = arr.length; i < len; i += chunkSize) {
            chunk.push(arr.slice(i, i + chunkSize));
        };
        return chunk;
    }

    public static loadYearChunk(from: number): Array<number> {
        let arr = [];
        for (let i = 0; i < VISIBLE_YEAR_CHUNKS_AT_A_TIME; i++) {
            arr.push(from + i);
        };
        return arr;
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

    public static extractDateValue(date: string, format: string, separator: string, regex: RegExp): number {
        //escape the sep character
        separator = `\\${separator}`;

        
        //get the month and remove the seps. Find the index and substr to get the month number
        const dateFormatter = format.replace(regex, "").replace(new RegExp(separator, "g"), "");
        const isLongMonth = dateFormatter.toLowerCase().indexOf("mmm") > -1;

        if (isLongMonth) {
            return AircalUtils.getMonthLabelValue(
                date.substr(format.indexOf(dateFormatter), dateFormatter.length)
            );
        };
        return parseInt(date.substr(format.indexOf(dateFormatter), dateFormatter.length));
    }

    public static getMonthLabelValue(monthLabel: string): number {
        const res = monthLabels.findIndex((label: string) => {
            label = label.toLowerCase();
            return label === monthLabel.toLowerCase();
        });
        return res + 1;
    }

    public static formatDate(date: Date | DateDisplayModel, formatStr: string): string {
        date instanceof DateDisplayModel ? date = date.day : date;
        if (!date || !isValid(date)) return "";

        return format(date, formatStr, { awareOfUnicodeTokens: true });
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

    public static parseMultipleStringToDates(dateRangeStr: string, format: string): any {
        const range = dateRangeStr.split(AIRCAL_CALENDAR_FORMAT_SEPARATOR);
        let acc = [];
        range.forEach((date: any) => {            
            acc.push(AircalUtils.parseStringToDate(date.trim(), format));
        });
        return acc;
    }

    public static parseStringToDate(selectedDate: string, format: string): Date {        
        return parse(selectedDate, format, new Date());
    }

    public static getSelectionText(begin: string, end: string): string {
        return `${begin} ${AIRCAL_CALENDAR_FORMAT_SEPARATOR} ${end}`;
    }
}