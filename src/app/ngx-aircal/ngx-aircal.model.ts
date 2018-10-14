export const AIRCAL_CALENDAR_SPACES = 35;
export const AIRCAL_CALENDAR_SHORTCUT_SEPARATOR = ".";

export class AircalModel {
    public selectedStartDate: any = null;
    public selectedEndDate: any = null;
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

export class AircalOptions {
    public defaultStart?: AircalDateModel = new AircalDateModel();
    public inlineMode: boolean = false; //Display the calendar without a form input @todo
    public startDate?: AircalDateModel = new AircalDateModel();
    public endDate?: AircalDateModel = new AircalDateModel();
    public dayLabels: any = {"Mo": "Mo", "Tu": "Tu", "We": "We", "Th": "Th", "Fr": "Fr", "Sa": "Sa", "Su": "Su"};
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