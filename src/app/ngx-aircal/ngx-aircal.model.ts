export const AIRCAL_CALENDAR_SPACES = 35;
export const AIRCAL_CALENDAR_SHORTCUT_SEPARATOR = ".";

export class AircalModel {
  public selectedStartDate: any;
  public selectedEndDate: any;
  public numberOfDaysSelected: {days: number, months: number, years: number} = {
    days: 0,
    months: 0,
    years: 0
  };

  constructor(

  ) {

  }
}






//TODO
/*
- Create form handlers
- Handle scenario where user updates options on the fly (e.g. updating the disableFormHere props)
-
- Export as a plugin
*/



export class AircalOptions {
  public defaultStart?: AircalDateModel | null = null;
  public inlineMode: boolean = false; //Display the calendar without a form input @todo
  public startDate?: AircalDateModel | null = null;
  public endDate?: AircalDateModel | null = null;
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
  public disableFromHereBackwards?: AircalDateModel | null = null; //@todo
  public disableFromHereForwards?: AircalDateModel | null = null; //@todo
  public monthSelector?: boolean = false; //@todo
  public yearSelector?: boolean = false; //@todo

  constructor(init?: Partial<AircalOptions>) {
    Object.assign(this, init);
  }
}

export class AircalDateModel {
  public year: string;
  public month: string;
  public day?: string = "01";

  constructor(
    init?: AircalDateModel
  ) {
    Object.assign(this, init);
  }
}

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