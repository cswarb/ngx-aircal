export type arrowBias = "left" | "middle" | "right";
export type calendarBias = "left" | "top" | "right" | "bottom";
export class AircalOptions {
    public defaultStart?: Date = new Date();
    public inlineMode: boolean = false;
    public disable: boolean = false;
    public singlePicker: boolean = false;
    public startDate?: Date = null;
    public endDate?: Date = null;
    public dayLabels: AircalDayLabels = new AircalDayLabels();
    public selectionShortcuts?: any = { "7.days": "7 Days", "14.days": "14 Days", "1.months": "1 Month", "6.months": "6 Months", "1.years": "1 Year" };
    public dateFormat?: string = "dd/MM/yyyy";
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