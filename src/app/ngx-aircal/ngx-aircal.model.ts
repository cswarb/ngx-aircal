import { addDays, addMonths, addYears, isSameMonth, isSameYear, isSameDay, isAfter, isBefore, isEqual, parse } from "date-fns";

export const AIRCAL_CALENDAR_SPACES = 35;
export const AIRCAL_CALENDAR_SHORTCUT_SEPARATOR = ".";
export const AIRCAL_CALENDAR_FORMAT_SEPARATOR = "-";

export class AircalModel {
    public selectedStartDate: any = null; //Display obj
    public selectedEndDate: any = null; //Display obj
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

export class AircalOptions {
    public defaultStart?: AircalDateModel = new AircalDateModel();
    public inlineMode: boolean = false; //Display the calendar without a form input @todo
    public startDate?: AircalDateModel = new AircalDateModel();
    public endDate?: AircalDateModel = new AircalDateModel();
    public dayLabels: AircalDayLabels = new AircalDayLabels();
    public selectionShortcuts?: any = {"7.days": "7 Days", "14.days": "14 Days", "1.months": "1 Month", "6.months": "6 Months", "1.years": "1 Year"};
    public dateFormat?: string = "DD/MM/YYYY";
    public previousMonthWrapAround?: boolean = true;
    public nextMonthWrapAround?: boolean = true;
    public daysSelectedCounterVisible?: boolean = true;
    public width?: string;
    public height?: string;
    public applyText?: string = "Apply";
    public clearText?: string = "Clear";
    public selectDateText?: string = "Select date";
    public selectDateCloseText?: string = "Close";
    public highlightToday?: boolean = true;
    public showClearBtn?: boolean = true;
    public showApplyBtn?: boolean = true;
    public showDaysSelected?: boolean = true;
    public minYear?: number = 1000;
    public maxYear?: number = 9999;
    public disablePreviousSelection?: boolean = false;
    public disableForwardSelection?: boolean = false;
    public disableFromHereBackwards?: AircalDateModel = new AircalDateModel();
    public disableFromHereForwards?: AircalDateModel = new AircalDateModel();
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

    public static isSameOrBefore(leftDate, rightDate): boolean {
        return this.isSame(leftDate, rightDate) || isBefore(leftDate, rightDate);
    }
    
    public static isSameOrAfter(leftDate, rightDate): boolean {
        return this.isSame(leftDate, rightDate) || isAfter(leftDate, rightDate);
    }
    
    public static isSame(leftDate, rightDate): boolean {
        return isEqual(leftDate, rightDate);
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

    public static isDateValid(date) {
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

    public static getSelectionText(begin: string, end: string): string {
        return `${begin} ${AIRCAL_CALENDAR_FORMAT_SEPARATOR} ${end}`;
    }
    
    public static stringToStartAndEnd(startAndEnd: string): { start: AircalDateModel, end: AircalDateModel } {
        //DDMMYYYY
        let d = startAndEnd.split(AIRCAL_CALENDAR_FORMAT_SEPARATOR),
            startDate = d[0].trim().split("/"),
            endDate = d[1].trim().split("/");
        
        return {
            start: new AircalDateModel({
                year: startDate[2],
                month: startDate[1],
                day: startDate[0]
            }),
            end: new AircalDateModel({
                year: endDate[2],
                month: endDate[1],
                day: endDate[0]
            })
        };
    }
}

export class AircalDateModel {
    public year: string | null = null;
    public month: string | null = null;
    public day?: string | null = null;

    constructor(
        init?: Partial<AircalDateModel>
    ) {
        Object.assign(this, init);
    }

    public isViable(): boolean {
        //Must have a properly formatted y m d
        return (this.year && this.year.length === 4 && this.month && this.month.length === 2 && this.day && this.day.length === 2);
    }

    public toDateFriendlyDateString(): string {
        //YYYYMMDD
        return `${this.year}${this.month}${this.day ? this.day : "01"}`;
    }

    public static parseModelToDate(selectedDate: AircalDateModel): Date {
        const date = parse(`${selectedDate.year}${selectedDate.month}${selectedDate.day}`);
        return date;
    }
    
    public static parseStringToDate(selectedDate: string): Date {
        //Take into account date format
        return parse(selectedDate);
    }

    public isPopulated(): boolean {
        return !!(this.year && this.month && this.year);
    }
}


//Reponses for Observables
export class AircalResponse {
    constructor(
        public startDate: AircalDateModel,
        public endDate: AircalDateModel,
        public formattedStartDate: string,
        public formattedEndDate: string
    ) {

    }
}