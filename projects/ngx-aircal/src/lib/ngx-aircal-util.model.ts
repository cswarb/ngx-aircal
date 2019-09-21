import { addDays, addMonths, addYears, isSameMonth, isSameYear, isSameDay, isAfter, isBefore, isEqual, parse, isValid, getYear, format, setMonth, getMonth } from "date-fns";
import { AircalDayLabels, arrowBias, calendarBias } from "./ngx-aircal.model";

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

    constructor(init?: Partial<AircalSelectedTime>) {
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

    public static formatDate(date: Date | DateDisplayModel, formatStr: string): string {
        date instanceof DateDisplayModel ? date = date.day : date;
        if (!date || !isValid(date)) return "";

        return format(date, formatStr, { useAdditionalDayOfYearTokens: true, useAdditionalWeekYearTokens: true });
    }

    public static isCurrentYearViable(year: number, minYear: number, maxYear: number) {
        return (year > minYear && year < maxYear);
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