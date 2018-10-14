export const AIRCAL_CALENDAR_SPACES = 35;
export const AIRCAL_CALENDAR_SHORTCUT_SEPARATOR = ".";

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
    public highlightToday?: boolean = true;
    public showClearBtn?: boolean = true;
    public minYear?: number = 1000;
    public maxYear?: number = 9999;
    public disablePreviousSelection?: boolean = false;
    public disableForwardSelection?: boolean = false;
    public disableFromHereBackwards?: AircalDateModel = new AircalDateModel(); //@todo
    public disableFromHereForwards?: AircalDateModel = new AircalDateModel(); //@todo
    public monthSelector?: boolean = false; //@todo
    public yearSelector?: boolean = false; //@todo

    constructor(init?: Partial<AircalOptions>) {
        Object.assign(this, init);
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

    public isValid(): boolean {
        //Must have at least a year and month to be valid
        return (!!this.year && !!this.month);
    }

    public toDateStr(): string {
        //YYYYMMDD
        return `${this.year}${this.month}${this.day ? this.day : "01"}`;
    }
}


//Reponses for Observables
export class AircalResponse {
    constructor(
        public startDate: string,
        public endDate: string,
        public formattedStartDate: string,
        public formattedEndDate: string
    ) {

    }
}

export class AircalFormResponse {
    constructor(
        public startDate: string,
        public endDate: string,
        public formattedStartDate: string,
        public formattedEndDate: string,
        public isValid: boolean
    ) {

    }
}