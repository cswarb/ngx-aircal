import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NgxAircalComponent } from "./ngx-aircal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AircalYearQuicksetComponent } from "./aircal-year-quickset/aircal-year-quickset.component";
import { AircalMonthQuicksetComponent } from "./aircal-month-quickset/aircal-month-quickset.component";
import { AircalDaysofweekComponent } from "./aircal-daysofweek/aircal-daysofweek.component";
import { AircalDayComponent } from "./aircal-day/aircal-day.component";
import { AircalDaysselectedComponent } from "./aircal-daysselected/aircal-daysselected.component";
import { AircalSelectComponent } from "./aircal-select/aircal-select.component";
import { CommonModule } from "@angular/common";
import { NgxAircalModule } from "./ngx-aircal.module";
import { Subject } from "rxjs";
import { AircalOptions, AircalResponse } from "./ngx-aircal.model";
import { By } from "@angular/platform-browser";
import { AIRCAL_CALENDAR_SPACES, AircalModel, DateDisplayModel, AircalHelpers, VISIBLE_YEAR_CHUNKS_AT_A_TIME } from "./ngx-aircal-util.model";

describe("NgxAircalComponent", () => {
  let component: NgxAircalComponent;
  let fixture: ComponentFixture<NgxAircalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxAircalModule
      ],
      declarations: [
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxAircalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  
  it("should default props correctly", () => {
    let date = new Date();
    let nextDate = new Date().setDate(new Date().getDate() + 1);
    let cur = component.createAircal(component.date);
    let nxt = component.createAircal(component.nextMonthDate);

    component.options.defaultStart = date;

    expect(component.date.getDate()).toEqual(date.getDate());
    expect(component.nextMonthDate.getDate()).toEqual(new Date().getDate());
    expect(component.daysWeeksArray).toEqual(cur.chunk);
    expect(component.daysArray).toEqual([]);
    expect(component.nextMonthDaysWeeksArray).toEqual(nxt.chunk);
    expect(component.nextMonthDaysArray).toEqual([]);
    expect(component.allDaysArray).toEqual(cur.spread.concat(nxt.spread));
    expect(component.calendarSpaces).toEqual(AIRCAL_CALENDAR_SPACES);
    expect(component.dateRangeValid).toEqual(true);
    expect(component.dateRangeValidIndicator).toEqual(true);
    expect(component.showCalendar).toEqual(false);
    expect(component.needsApplying).toEqual(false);
    expect(component.yearSelectionPanelOpen).toEqual(false);
    expect(component.yearChoices).toEqual([]);
    expect(component.monthSelectionPanelOpen).toEqual(false);
    expect(component.monthChoices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(component.formSelectionText).toEqual("");
    expect(component.aircal).toEqual(new AircalModel());
    expect(component.options).toEqual(new AircalOptions({
      defaultStart: date
    }));
    expect(component.onDateRangeCommitted).toEqual(new Subject());
    expect(component.onInputFieldChanged).toEqual(new Subject());
    expect(component.onCalendarViewChanged).toEqual(new Subject());
    expect(component.onDateRangeCleared).toEqual(new Subject());
    expect(component.onDateRangeChanged).toEqual(new Subject());
    expect(component.onDateRangeInitialised).toEqual(new Subject());
  });

  it("should initialise an start date", () => {
    let d = new Date();
    component.options.startDate = d;
    component.ngOnInit();

    expect(component.aircal.selectedStartDate.day).toEqual(d);
  });
  
  it("should initialise an end date", () => {
    let d = new Date();
    component.options.endDate = d;
    component.ngOnInit();

    expect(component.aircal.selectedStartDate.day).toEqual(d);
  });
  
  it("should create a calendar given a date", () => {
    const d = new Date(2019, 8, 8);
    let data = component.createAircal(d);

    //December has an additional date to create so it exceeds the calendar spaces logic. T@odo - Refactor it
    expect(data.spread.length).toBeLessThanOrEqual(AIRCAL_CALENDAR_SPACES);
    expect(data.chunk.length).toBeLessThanOrEqual(6);
    function isInstanceOfDateModel(dateModel) {
      return expect(dateModel instanceof DateDisplayModel).toEqual(true);
    }
    data.spread.map(isInstanceOfDateModel);
  });

  it("should return a chunk array given a large array of results", () => {
    let d = [];
    for (let index = 0; index < 36; index++) {
      d.push(
        new DateDisplayModel()
      );
    }
    let chunked = AircalHelpers.chunk(d, 3);

    expect(chunked.length).toEqual(12);
  });
  
  it("should return a chunk array given a large array of results", () => {
    var day = new Date().getDate();
    var dayPlusFive = new Date().setDate(day + 5);
    const exampleDateRange = `e.g. ${component.formatDate(new Date())} - ${component.formatDate(new Date(dayPlusFive))}`;
    expect(component.getDynamicPlaceholderText()).toEqual(exampleDateRange);
  });
  
  it("should select a month", () => {
    component.selectMonth(7);
    let d = new Date(new Date().setMonth(7));
    expect(component.date.getMonth()).toEqual(d.getMonth());
  });
  
  it("should select a year", () => {
    component.selectYear(2020);
    let d = new Date(new Date().setFullYear(2020));
    expect(component.date.getFullYear()).toEqual(d.getFullYear());
  });
  
  it("should toggle month selection", () => {
    component.toggleMonthSelection();

    expect(component.yearSelectionPanelOpen).toEqual(false);
    expect(component.monthSelectionPanelOpen).toEqual(true);
  });
  
  it("should toggle year selection", () => {
    component.toggleYearSelection();

    expect(component.yearSelectionPanelOpen).toEqual(true);
    expect(component.monthSelectionPanelOpen).toEqual(false);
  });
  
  it("should get next years chunks", () => {
    expect(component.yearChoices).toEqual([]);

    component.toggleYearSelection();

    component.nextYearChunks();

    let curYear = new Date().getFullYear() + 10;
    let c = [];

    for (let index = 0; index < 11; index++) {
      c.push(curYear++);
    }
    expect(component.yearChoices).toEqual(c);
  });
  
  it("should get last years chunks", () => {
    expect(component.yearChoices).toEqual([]);

    component.toggleYearSelection();

    component.prevYearChunks();

    let curYear = new Date().getFullYear() - 10;
    let c = [];

    for (let index = 0; index < 11; index++) {
      c.push(curYear++);
    }
    expect(component.yearChoices).toEqual(c);
    expect(component.yearChoices.length).toEqual(VISIBLE_YEAR_CHUNKS_AT_A_TIME);
  });
  
  it("should toggle year selection choices", () => {
    component.toggleYearSelection();

    let curYear = new Date().getFullYear();
    let c = [];

    for (let index = 0; index < 11; index++) {
      c.push(curYear++);
    }

    expect(component.yearChoices).toEqual(c);
  });
  
  it("should toggle the calendar open and closed", () => {
    component.openCalendar();
    expect(component.showCalendar).toEqual(true);
    
    component.openCalendar();
    expect(component.showCalendar).toEqual(false);
  });
  
  it("should format the date", () => {
    let d = new Date(2019, 7, 10);
    expect(component.formatDate(d, "dd/MM/yyyy")).toEqual("10/08/2019");

    let nd = new DateDisplayModel({
      day: new Date(2020, 6, 8)
    });
    expect(component.formatDate(nd, "dd/MM/yyyy")).toEqual("08/07/2020");
    
    let nd2 = new DateDisplayModel({
      day: new Date(2020, 6, 8)
    });
    expect(component.formatDate(nd2, "dd-MM-yy")).toEqual("08-07-20");
  });
  
  it("should detect if the current date is today", () => {
    let d = new DateDisplayModel({
      day: new Date(2020, 6, 8)
    });
    expect(component.isToday(d)).toEqual(false);
    
    let td = new DateDisplayModel({
      day: new Date()
    });
    expect(component.isToday(td)).toEqual(true);
  });

  it("should honor permissions for previous month", () => {
    component.options.minYear = 2016;
    component.date = new Date(2017, 0, 1);
    expect(component.canSelectPreviousMonth()).toEqual(false);

    component.date = new Date(2016, 0, 1);
    expect(component.canSelectPreviousMonth()).toEqual(false);
    
    component.date = new Date(2018, 0, 1);
    expect(component.canSelectPreviousMonth()).toEqual(true);
  });
  
  it("should honor permissions for next month", () => {
    component.options.maxYear = 2019;
    component.nextMonthDate = new Date(2018, 11, 31);
    expect(component.canSelectNextMonth()).toEqual(false);

    component.nextMonthDate = new Date(2019, 0, 1);
    expect(component.canSelectNextMonth()).toEqual(false);
    
    component.nextMonthDate = new Date(2010, 4, 2);
    expect(component.canSelectNextMonth()).toEqual(true);
  });
  
  it("should select a date in the correct sequence", () => {
    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    let endD = new DateDisplayModel({
      day: new Date(2018, 11, 15)
    });
    let switchD = new DateDisplayModel({
      day: new Date(2018, 11, 14)
    });
    let switchStartD = new DateDisplayModel({
      day: new Date(2018, 11, 9)
    });
    
    component.selectDate(d);
    expect(component.aircal.selectedStartDate.day).toBeTruthy();
    expect(component.aircal.selectedStartDate.day).toEqual(d.day);
    
    component.selectDate(endD);
    expect(component.aircal.selectedStartDate.day).toEqual(d.day);
    expect(component.aircal.selectedEndDate.day).toBeTruthy();
    expect(component.aircal.selectedEndDate.day).toEqual(endD.day);
    
    component.selectDate(switchD);
    expect(component.aircal.selectedStartDate.day).toEqual(d.day);
    expect(component.aircal.selectedEndDate.day).toEqual(switchD.day);
    
    component.selectDate(switchStartD);
    expect(component.aircal.selectedStartDate.day).toEqual(switchStartD.day);
    expect(component.aircal.selectedEndDate.day).toEqual(switchD.day);
  });

  it("should allow quickset selection", () => {
    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    component.selectDate(d);

    let shortcut = "7.Days";
    let newD = Object.create(d);
    newD.day = new Date(2018, 11, 14);

    component.selectionShortcutChanged(shortcut);

    expect(component.aircal.selectedStartDate.day).toEqual(d.day);
    expect(component.aircal.selectedEndDate.day).toEqual(newD.day);
  });
  
  it("should honor the disabling of forward selection", () => {
    component.options.minYear = 2018;
    component.options.maxYear = 2018;
    component.date = new Date(2018, 0, 1);

    component.nextMonth();
    expect(component.aircal.disableForwardSelection).toEqual(true);

    component.prevMonth();
    expect(component.aircal.disablePreviousSelection).toEqual(true);
  });
  
  it("should honor the disabling of forward and previous selection", () => {
    component.options.minYear = 2018;
    component.options.maxYear = 2018;
    component.date = new Date(2018, 0, 1);

    component.nextMonth();
    expect(component.aircal.disableForwardSelection).toEqual(true);

    component.prevMonth();
    expect(component.aircal.disablePreviousSelection).toEqual(true);
  });
  
  it("should determine is a day is selected", () => {
    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    let endD = new DateDisplayModel({
      day: new Date(2018, 11, 15)
    });
    let c = new DateDisplayModel({
      day: new Date(2018, 11, 10)
    });
    let b = new DateDisplayModel({
      day: new Date(2018, 11, 6)
    });
    component.selectDate(d);
    component.selectDate(endD);

    expect(component.isSelected(d)).toEqual(true);
    expect(component.isSelected(endD)).toEqual(true);
    expect(component.isSelected(c)).toEqual(true);
    expect(component.isSelected(b)).toEqual(false);
  });
  
  it("should allow the user to input a date", () => {
    component.onUserInput("27/06/2018 - 28/06/2018");
    const sd = new Date(2018, 5, 27);
    const ed = new Date(2018, 5, 28);

    expect(component.aircal.selectedStartDate.day).toEqual(sd);
    expect(component.aircal.selectedEndDate.day).toEqual(ed);
  });
  
  it("should not try to commit a date until both values are present and other scenarios", () => {
    component.onUserInput("27/06/2018");
    expect(component.aircal.selectedStartDate.day).toEqual(null);
    expect(component.aircal.selectedEndDate.day).toEqual(null);

    component.onUserInput("null");
    expect(component.aircal.selectedStartDate.day).toEqual(null);
    expect(component.aircal.selectedEndDate.day).toEqual(null);

    component.onUserInput("");
    expect(component.aircal.selectedStartDate.day).toEqual(null);
    expect(component.aircal.selectedEndDate.day).toEqual(null);
  });
  
  it("should honor the formatting while the user is inputting values", () => {
    component.options.dateFormat = "MM.dd.yyyy";
    component.onUserInput("06.15.2018 - 06.16.2018");
    const sd = new Date(2018, 5, 15);
    const ed = new Date(2018, 5, 16);
    
    expect(component.aircal.selectedStartDate.day).toEqual(sd);
    expect(component.aircal.selectedEndDate.day).toEqual(ed); 
  });
  
  it("should honor the formatting while the user is inputting values when incorrect input is given", () => {
    component.options.dateFormat = "MM.dd.yyyy";
    component.onUserInput("15.06.2018 - 16.06.2018");
    const sd = new Date(2018, 5, 15);
    const ed = new Date(2018, 5, 16);
    
    expect(component.aircal.selectedStartDate.day).toEqual(null);
    expect(component.aircal.selectedEndDate.day).toEqual(null);
  });
  
  it("should detect date range committed event", () => {
    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    let endD = new DateDisplayModel({
      day: new Date(2018, 11, 15)
    });
    component.selectDate(d);
    component.selectDate(endD);

    component.onDateRangeCommitted.subscribe((res: AircalResponse) => {
      expect(res.startDate).toEqual(d.day);
      expect(res.endDate).toEqual(endD.day);
    });
    component._dateRangeCommitted(); 
  });
  
  it("should detect date range initialised event", () => {
    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    let endD = new DateDisplayModel({
      day: new Date(2018, 11, 15)
    });
    component.selectDate(d);
    component.selectDate(endD);

    component.onDateRangeInitialised.subscribe((res: AircalResponse) => {
      expect(res.startDate).toEqual(d.day);
      expect(res.endDate).toEqual(endD.day);
    });
    component._dateRangeInitialised(); 
  });
  
  it("should detect date range changed event", () => {
    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    let endD = new DateDisplayModel({
      day: new Date(2018, 11, 15)
    });
    component.selectDate(d);
    component.selectDate(endD);

    component.onDateRangeChanged.subscribe((res: AircalResponse) => {
      expect(res.startDate).toEqual(d.day);
      expect(res.endDate).toEqual(endD.day);
    });
    component._dateRangeChanged(); 
  });
  
  it("should detect calendar view changed event", () => {
    component.onCalendarViewChanged.subscribe((res: AircalResponse) => {
      expect(res.startDate).toEqual(null);
      expect(res.endDate).toEqual(null);
      expect(res.formattedEndDate).toEqual("");
      expect(res.formattedStartDate).toEqual("");
    });
    component._calendarViewChanged(); 
  });

  it("should detect input field changed event", () => {
    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    let endD = new DateDisplayModel({
      day: new Date(2018, 11, 15)
    });
    component.selectDate(d);
    component.selectDate(endD);

    component.onInputFieldChanged.subscribe((res: AircalResponse) => {
      expect(res.startDate).toEqual(d.day);
      expect(res.endDate).toEqual(endD.day);
    });
    component._inputFieldChanged(); 
  });
  
  it("should detect date range cleared event", () => {
    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    let endD = new DateDisplayModel({
      day: new Date(2018, 11, 15)
    });
    component.selectDate(d);
    component.selectDate(endD);

    component.onDateRangeCleared.subscribe((res: AircalResponse) => {
      expect(res.startDate).toEqual(d.day);
      expect(res.endDate).toEqual(endD.day);
    });
    component._dateRangeCleared(); 
    expect(component.aircal.selectedStartDate.day).toEqual(null);
    expect(component.aircal.selectedEndDate.day).toEqual(null);
    expect(component.formSelectionText).toEqual("");
  });
  
  //Dom interaction tests  
  it("should open the calendar", () => {
    let btn = fixture.debugElement.query(By.css('.aircal__meta__input__icon.aircal__meta__input__icon--opening'));
    let cal = fixture.debugElement.query(By.css('.aircal__meta__input__container'));
    
    btn.triggerEventHandler("click", () => {});
    
    expect(component.showCalendar).toEqual(true);
  });

});
