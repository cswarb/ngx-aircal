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
import { AIRCAL_CALENDAR_SPACES, AircalModel, AircalOptions, DateDisplayModel, VISIBLE_YEAR_CHUNKS_AT_A_TIME, AircalResponse, AircalDayLabels } from "./ngx-aircal.model";
import { By } from "@angular/platform-browser";

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

  it("should allow a default start to be set", () => {
    let d = new Date(2018, 5, 5);
    component.options.defaultStart = d;

    component.ngOnInit();
    
    expect(component.date).toEqual(d);
  });
  
  it("should allow inline mode to be set correctly", () => {
    component.options.inlineMode = false;
    component.ngOnInit();
    fixture.detectChanges();
    let cal = fixture.debugElement.query(By.css(".aircal__meta__input__container"));
    expect(cal).toBeTruthy();
    expect(component.options.inlineMode).toEqual(false);
  });
  
  it("should allow inline mode to be set correctly", () => {
    component.options.inlineMode = true;
    component.ngOnInit();
    fixture.detectChanges();
    let cal = fixture.debugElement.query(By.css(".aircal__meta__input__container"));
    //aircal__meta__input__container should nto exist when true
    expect(cal).toEqual(null);
    expect(component.options.inlineMode).toEqual(true);
  });
  
  it("should honor single picker option 2", () => {
    component.options.singlePicker = false;
    component.ngOnInit();
    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    
    btn.triggerEventHandler("click", () => { });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let cal = fixture.debugElement.query(By.css(".aircal__cal--double"));
      expect(fixture.nativeElement.querySelectorAll(".aircal__cal--double").length).toEqual(2);
    });
  });
  
  it("should honor single picker option 1", () => {
    component.options.singlePicker = true;
    component.ngOnInit();
    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let cal = fixture.debugElement.query(By.css(".aircal__cal--double"));
      expect(fixture.nativeElement.querySelectorAll(".aircal__cal--double").length).toEqual(1);
    });
  });
  
  it("should honor startDate", () => {
    const d = component.options.startDate = new Date(2019, 5, 5);
    component.ngOnInit();

    expect(component.options.startDate).toEqual(d);
    expect(component.aircal.selectedStartDate).toEqual(new DateDisplayModel({
      day: d
    }));
  });
  
  it("should honor endDate", () => {
    const sd = component.options.startDate = new Date(2019, 5, 5);
    const ed = component.options.endDate = new Date(2019, 5, 6);
    component.ngOnInit();

    expect(component.options.endDate).toEqual(ed);
    expect(component.aircal.selectedEndDate).toEqual(new DateDisplayModel({
      day: ed
    }));
  });
  
  it("should honor dayLabels", () => {
    component.options.dayLabels = new AircalDayLabels({
      mo: "Monday"
    });

    component.ngOnInit();

    expect(component.options.dayLabels.mo).toEqual("Monday");

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__daysofweek:first-of-type > span")).nativeElement.innerText).toEqual("Monday");
    });
  });
  
  it("should honor selectionShortcuts", () => {
    component.options.selectionShortcuts = {"10.days": "10 Days"}
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__shortcut > option:last-of-type")).nativeElement.innerText).toEqual("10 Days");
    });

    let d = new DateDisplayModel({
      day: new Date(2018, 11, 1)
    });
    component.selectDate(d);

    component.selectionShortcutChanged("10.days");
    expect(component.aircal.selectedEndDate.day).toEqual(
      new Date(2018, 11, 11)
    );
  });
  
  it("should honor dateFormat", () => {
    component.options.dateFormat = "MM/YYYY/DD";
    component.ngOnInit();

    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    let endD = new DateDisplayModel({
      day: new Date(2018, 11, 15)
    });
    component.selectDate(d);
    component.selectDate(endD);

    component.onDateRangeCommitted.subscribe((res: AircalResponse) => {
      expect(res.formattedStartDate).toEqual("12/2018/07");
      expect(res.formattedEndDate).toEqual("12/2018/15");
    });
    component._dateRangeCommitted(); 
  });
  
  it("should honor previousMonthWrapAround", () => {
    //This alters highlighting behaviour?
    component.options.previousMonthWrapAround = false;
    component.ngOnInit();
    
    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__week:first-of-type > .aircal__day__container")).nativeElement.classList.contains("aircal--inactive")).toEqual(true);
      expect(fixture.debugElement.query(By.css(".aircal__week:first-of-type > .aircal__day__container > .aircal__day > span")).nativeElement.innerText).toEqual("");
    });
  });
  
  it("should honor nextMonthWrapAround", () => {
    component.options.nextMonthWrapAround = false;
    component.ngOnInit();
    
    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__week:last-of-type > .aircal__day__container:last-of-type")).nativeElement.classList.contains("aircal--inactive")).toEqual(true);
      expect(fixture.debugElement.query(By.css(".aircal__week:last-of-type > .aircal__day__container:last-of-type > .aircal__day > span")).nativeElement.innerText).toEqual("");
    });
  });
  
  it("should honor daysSelectedCounterVisible", () => {
    component.options.daysSelectedCounterVisible = false;
    component.ngOnInit();

    let d = new DateDisplayModel({
      day: new Date(2018, 11, 7)
    });
    let endD = new DateDisplayModel({
      day: new Date(2018, 11, 15)
    });
    component.selectDate(d);
    component.selectDate(endD);
    
    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css("[data-aircal-daysselected]"))).toEqual(null);
    });
  });
  
  it("should honor selectionShortcutVisible", () => {
    component.options.selectionShortcutVisible = false;
    component.ngOnInit();
    
    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__shortcut"))).toEqual(null);
    });
  });
  
  it("should honor backgroundVisible", () => {
    component.options.backgroundVisible = false;
    component.ngOnInit();
    
    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(window.getComputedStyle(fixture.debugElement.query(By.css(".aircal")).nativeElement).getPropertyValue("background-color")).toEqual("rgba(0, 0, 0, 0)");
    });
  });
  
  it("should honor width", () => {
    component.options.width = "500px";
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal")).nativeElement.style.width).toEqual("500px");
    });
  });
  
  it("should honor height", () => {
    component.options.height = "500px";
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal")).nativeElement.style.height).toEqual("500px");
    });
  });

  it("should honor applyText", () => {
    component.options.applyText = "Apply me";
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__button--apply")).nativeElement.innerText).toEqual("Apply me");
    });
  });

  it("should honor clearText", () => {
    component.options.clearText = "Close me";
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__button--cancel")).nativeElement.innerText).toEqual("Close me");
    });
  });

  it("should honor selectDateText", () => {
    component.options.selectDateCloseText = "Select me";
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__meta__input__icon--opening")).nativeElement.innerText).toEqual("Select me");
    });
  });

  it("should honor selectDateCloseText", () => {
    component.options.selectDateCloseText = "Close me";
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__meta__input__icon--opening")).nativeElement.innerText).toEqual("Close me");
    });
  });

  it("should honor highlightToday", () => {
    component.options.highlightToday = true;
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal--istoday")).nativeElement).toBeTruthy();
    });
    
    component.options.highlightToday = false;
    component.ngOnInit();

    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal--istoday")).nativeElement).toBeFalsy();
    });
  });

  it("should honor showClearBtn", () => {
    component.options.showClearBtn = false;
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__button--cancel"))).toEqual(null);
    });
  });

  it("should honor showApplyBtn", () => {
    component.options.showApplyBtn = false;
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__button--apply"))).toEqual(null);
    });
  });

  it("should honor minYear", () => {
    component.options.minYear = 2016;
    component.options.defaultStart = new Date(2017, 0, 1);
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__icon__prev")).nativeElement.disabled).toEqual(true);
    });
  });

  it("should honor maxYear", () => {
    component.options.maxYear = 2018;
    component.options.defaultStart = new Date(2017, 11, 1);
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__icon__next")).nativeElement.disabled).toEqual(true);
    });
  });

  it("should honor disablePreviousSelection", () => {
    component.options.disablePreviousSelection = true;
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__icon__prev")).nativeElement.disabled).toEqual(true);
    });
  });

  it("should honor disableForwardSelection", () => {
    component.options.disableForwardSelection = true;
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__icon__next")).nativeElement.disabled).toEqual(true);
    });
  });

  it("should honor disableFromHereBackwards", () => {
    component.options.disableFromHereBackwards = new Date(2018, 10, 15);
    component.options.defaultStart = new Date(2018, 10, 1);
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__day__container:first-of-type")).nativeElement.classList.contains("aircal--inactive")).toEqual(true);
    });
  });

  it("should honor disableFromHereForwards", () => {
    component.options.disableFromHereForwards = new Date(2018, 10, 15);
    component.options.defaultStart = new Date(2018, 10, 1);
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__week:last-of-type .aircal__day__container:last-of-type")).nativeElement.classList.contains("aircal--inactive")).toEqual(true);
    });
  });

  it("should honor indicateInvalidDateRange", () => {
    //todo
  });

  it("should honor hasArrow", () => {
    component.options.hasArrow = false;
    component.ngOnInit();
    fixture.detectChanges();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal")).nativeElement.classList.contains("aircal--has-arrow")).toEqual(false);
    });
  });

  it("should honor arrowBias", () => {
    component.options.arrowBias = "right";
    component.ngOnInit();
    fixture.detectChanges();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal")).nativeElement.classList.contains("aircal--right-bias")).toEqual(true);
    });
  });

  it("should honor calendarPosition", () => {
    component.options.calendarPosition = "right";
    component.ngOnInit();
    fixture.detectChanges();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal")).nativeElement.classList.contains("aircal__orient--right")).toEqual(true);
    });
  });

  it("should honor allowQuicksetMonth", () => {
    component.options.allowQuicksetMonth = false
    component.ngOnInit();
    fixture.detectChanges();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__text__month > span")).nativeElement.classList.contains("aircal__clickable")).toEqual(false);
    });
  });

  it("should honor allowQuicksetYear", () => {
    component.options.allowQuicksetYear = false
    component.ngOnInit();
    fixture.detectChanges();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css(".aircal__text__month > span:last-child")).nativeElement.classList.contains("aircal__clickable")).toEqual(false);
    });
  });

  it("should honor icons", () => {
    component.options.icons.leftArrow = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzEuNDk0IDMxLjQ5NCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzEuNDk0IDMxLjQ5NDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6IzFFMjAxRDsiIGQ9Ik0xMC4yNzMsNS4wMDljMC40NDQtMC40NDQsMS4xNDMtMC40NDQsMS41ODcsMGMwLjQyOSwwLjQyOSwwLjQyOSwxLjE0MywwLDEuNTcxbC04LjA0Nyw4LjA0N2gyNi41NTQNCgljMC42MTksMCwxLjEyNywwLjQ5MiwxLjEyNywxLjExMWMwLDAuNjE5LTAuNTA4LDEuMTI3LTEuMTI3LDEuMTI3SDMuODEzbDguMDQ3LDguMDMyYzAuNDI5LDAuNDQ0LDAuNDI5LDEuMTU5LDAsMS41ODcNCgljLTAuNDQ0LDAuNDQ0LTEuMTQzLDAuNDQ0LTEuNTg3LDBsLTkuOTUyLTkuOTUyYy0wLjQyOS0wLjQyOS0wLjQyOS0xLjE0MywwLTEuNTcxTDEwLjI3Myw1LjAwOXoiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K";
    component.ngOnInit();

    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    btn.triggerEventHandler("click", () => { });
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(window.getComputedStyle(fixture.debugElement.query(By.css(".aircal__icon__prev")).nativeElement).getPropertyValue("background-image")).toContain("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzEuNDk0IDMxLjQ5NCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzEuNDk0IDMxLjQ5NDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6IzFFMjAxRDsiIGQ9Ik0xMC4yNzMsNS4wMDljMC40NDQtMC40NDQsMS4xNDMtMC40NDQsMS41ODcsMGMwLjQyOSwwLjQyOSwwLjQyOSwxLjE0MywwLDEuNTcxbC04LjA0Nyw4LjA0N2gyNi41NTQNCgljMC42MTksMCwxLjEyNywwLjQ5MiwxLjEyNywxLjExMWMwLDAuNjE5LTAuNTA4LDEuMTI3LTEuMTI3LDEuMTI3SDMuODEzbDguMDQ3LDguMDMyYzAuNDI5LDAuNDQ0LDAuNDI5LDEuMTU5LDAsMS41ODcNCgljLTAuNDQ0LDAuNDQ0LTEuMTQzLDAuNDQ0LTEuNTg3LDBsLTkuOTUyLTkuOTUyYy0wLjQyOS0wLjQyOS0wLjQyOS0xLjE0MywwLTEuNTcxTDEwLjI3Myw1LjAwOXoiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K");
    });
  });
  
});