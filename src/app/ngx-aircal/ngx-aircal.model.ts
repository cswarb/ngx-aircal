export class AircalModel {
  public options: AircalOptions = new AircalOptions();
  constructor() {

  }
}

export class AircalOptions {
  public startDate?: AircalDateModel;
  public endDate?: AircalDateModel;
  public dayLabels: any = {"Mo": "Mo", "Tu": "Tu", "We": "We", "Th": "Th", "Fr": "Fr", "Sa": "Sa", "Su": "Su"};
  public selectionShortcuts?: any = {"7D": "7 Days", "14D": "14 Days", "1M": "1 Month", "6M": "6 Months", "1Y": "1 Year"}; //@todo
  public dateFormat?: string;
  public previousMonthWrapAround?: boolean = true;
  public nextMonthWrapAround?: boolean = true;
  public daysSelectedCounterVisible?: boolean = true;
  public width?: string;
  public height?: string;
  public applyText?: string = "Apply";
  public clearText?: string = "Clear";
  public highlightToday?: boolean = true;
  public showClearBtn?: boolean = true;
  public markCurrentDay?: boolean = true;
  public minYear?: number = 0;
  public maxYear?: number = 9999;
  public disableFromHereBackwards?: AircalDateModel; //@todo
  public disableFromHereForwards?: AircalDateModel; //@todo
  public monthSelector?: boolean = false; //@todo
  public yearSelector?: boolean = false; //@todo

  constructor(init?: Partial<AircalOptions>) {
    return Object.assign(this, init);
  }
}

export class AircalDateModel {
  public year: string;
  public month: string;
  public day: string;
  public formattedString: string;
}

export class AircalResponse {
  constructor(
    public startDate: string,
    public endDate: string
  ) {

  }
}

export class AircalFormResponse {
  constructor(
    public startDate: string,
    public endDate: string,
    public isValid: boolean
  ) {

  }
}