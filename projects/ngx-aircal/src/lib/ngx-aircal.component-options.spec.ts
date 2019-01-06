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
  
  //@todo
  // fit("should allow inline mode to be set correctly", () => {
  //   component.options.inlineMode = false;
  //   component.ngOnInit();
  //   let cal = fixture.debugElement.query(By.css(".aircal__meta__input__container"));
  //   expect(cal.nativeElement.classList.contains("aircal__meta__input__container")).toEqual(true);
  //   expect(component.options.inlineMode).toEqual(false);

  //   component.options.inlineMode = true;
  //   component.ngOnInit();

  //   cal = fixture.debugElement.query(By.css(".aircal__meta__input__container"));
  //   //aircal__meta__input__container should nto exist when true
  //   expect(cal.nativeElement.classList.contains("aircal__meta__input__container")).toEqual(false);
  //   expect(component.options.inlineMode).toEqual(true);
  // });
  
  it("should honor single picker option", () => {
    component.options.singlePicker = false;
    let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
    
    btn.triggerEventHandler("click", () => { });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let cal = fixture.debugElement.query(By.css(".aircal__cal--double"));
      expect(fixture.nativeElement.querySelectorAll(".aircal__cal--double").length).toEqual(2);
    });

    component.options.singlePicker = true;
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
  
  //@todo
  // fit("should honor selectionShortcuts", () => {
  //   component.options.dayLabels = new AircalDayLabels({
  //     mo: "Monday"
  //   });

  //   component.ngOnInit();

  //   expect(component.options.dayLabels.mo).toEqual("Monday");

  //   let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
  //   btn.triggerEventHandler("click", () => { });
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect(fixture.debugElement.query(By.css(".aircal__daysofweek:first-of-type > span")).nativeElement.innerText).toEqual("Monday");
  //   });
  // });
  
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
  
  //@todo
  // fit("should honor daysSelectedCounterVisible", () => {
  //   component.options.daysSelectedCounterVisible = false;
  //   component.ngOnInit();

  //   let d = new DateDisplayModel({
  //     day: new Date(2018, 11, 7)
  //   });
  //   let endD = new DateDisplayModel({
  //     day: new Date(2018, 11, 15)
  //   });
  //   component.selectDate(d);
  //   component.selectDate(endD);
    
  //   let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
  //   btn.triggerEventHandler("click", () => { });
  //   fixture.detectChanges();
    
  //   fixture.whenStable().then(() => {
  //     expect(fixture.debugElement.query(By.css(".aircal__meta__rows--first")).nativeElement.innerText).toEqual("p");
  //   });
  // });
  
  //@todo
  // fit("should honor selectionShortcutVisible", () => {
  //   component.options.daysSelectedCounterVisible = false;
  //   component.ngOnInit();

  //   let d = new DateDisplayModel({
  //     day: new Date(2018, 11, 7)
  //   });
  //   let endD = new DateDisplayModel({
  //     day: new Date(2018, 11, 15)
  //   });
  //   component.selectDate(d);
  //   component.selectDate(endD);
    
  //   let btn = fixture.debugElement.query(By.css(".aircal__meta__input__icon.aircal__meta__input__icon--opening"));
  //   btn.triggerEventHandler("click", () => { });
  //   fixture.detectChanges();

  //   fixture.whenStable().then(() => {
  //     expect(fixture.debugElement.query(By.css(".aircal__meta__rows--first")).nativeElement.innerText).toEqual("p");
  //   });
  // });
  
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
  
  fit("should honor width", () => {
  });
  
  fit("should honor height", () => {
  });

  fit("should honor applyText", () => {
  });

  fit("should honor clearText", () => {
  });

  fit("should honor selectDateText", () => {
  });

  fit("should honor selectDateCloseText", () => {
  });

  fit("should honor highlightToday", () => {
  });

  fit("should honor showClearBtn", () => {
  });

  fit("should honor showApplyBtn", () => {
  });

  fit("should honor minYear", () => {
  });

  fit("should honor maxYear", () => {
  });

  fit("should honor disablePreviousSelection", () => {
  });

  fit("should honor disableForwardSelection", () => {
  });

  fit("should honor disableFromHereBackwards", () => {
  });

  fit("should honor disableFromHereForwards", () => {
  });

  fit("should honor indicateInvalidDateRange", () => {
  });

  fit("should honor hasArrow", () => {
  });

  fit("should honor arrowBias", () => {
  });

  fit("should honor calendarPosition", () => {
  });

  fit("should honor allowQuicksetMonth", () => {
  });

  fit("should honor allowQuicksetYear", () => {
  });

  fit("should honor icons", () => {
  });
  
});