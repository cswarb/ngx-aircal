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
import { AIRCAL_CALENDAR_SPACES, AircalModel, AircalOptions } from "./ngx-aircal.model";

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

});
