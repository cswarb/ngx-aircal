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
import { AIRCAL_CALENDAR_SPACES, AircalModel, AircalOptions, DateDisplayModel, VISIBLE_YEAR_CHUNKS_AT_A_TIME } from "./ngx-aircal.model";

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
    expect(component.invalidDateRange).toEqual(false);
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
    let data = component.createAircal(new Date());

    // console.log(data);

    expect(data.spread.length).toBeLessThanOrEqual(AIRCAL_CALENDAR_SPACES);
    function isInstanceOfDateModel(dateModel) {
      return expect(dateModel instanceof DateDisplayModel).toEqual(true);
    }
    data.spread.map(isInstanceOfDateModel)

    //Todo - Calculate and check the start and end dates of the array to ensure they are correct
  });

  it("should return a chunk array given a large array of results", () => {
    let d = [];
    for (let index = 0; index < 36; index++) {
      d.push(
        new DateDisplayModel()
      );
    }
    let chunked = component.chunk(d, 3);

    expect(chunked.length).toEqual(12);
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
    expect(component.formatDate(d)).toEqual("10/08/2019");

    let nd = new DateDisplayModel({
      day: new Date(2020, 6, 8)
    });
    expect(component.formatDate(nd)).toEqual("08/07/2020");
    
    let nd2 = new DateDisplayModel({
      day: new Date(2020, 6, 8)
    });
    expect(component.formatDate(nd2, "DD-MM-YY")).toEqual("08-07-20");
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

});
