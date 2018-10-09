export const AIRCAL_CALENDAR_SPACES = 35;

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

export class AircalOptions {
  public startDate?: AircalDateModel = null;
  public endDate?: AircalDateModel = null;
  public dayLabels: any = {"Mo": "Mo", "Tu": "Tu", "We": "We", "Th": "Th", "Fr": "Fr", "Sa": "Sa", "Su": "Su"};
  public selectionShortcuts?: any = {"7D": "7 Days", "14D": "14 Days", "1M": "1 Month", "6M": "6 Months", "1Y": "1 Year"}; //@todo
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
  public minYear?: number = 0; //@todo
  public maxYear?: number = 9999; //@todo
  public disableFromHereBackwards?: AircalDateModel; //@todo
  public disableFromHereForwards?: AircalDateModel; //@todo
  public monthSelector?: boolean = false; //@todo
  public yearSelector?: boolean = false; //@todo

  constructor(init?: Partial<AircalOptions>) {
    Object.assign(this, init);
  }
}

export class AircalDateModel {
  public year: number;
  public month: number;
  public day: number;

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