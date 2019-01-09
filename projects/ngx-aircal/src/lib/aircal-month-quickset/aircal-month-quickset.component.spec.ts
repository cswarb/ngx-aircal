import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AircalMonthQuicksetComponent } from "./aircal-month-quickset.component";
import { Subject } from "rxjs";

describe("AircalMonthQuicksetComponent", () => {
  let component: AircalMonthQuicksetComponent;
  let fixture: ComponentFixture<AircalMonthQuicksetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircalMonthQuicksetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircalMonthQuicksetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  
  it("should default props correctly", () => {
    expect(component.monthChoices).toEqual([]);
    expect(component.date.getDate()).toEqual(new Date().getDate());
    expect(component.monthSelected).toEqual(new Subject());
  });
  
  it("should trigger a subscriber when month is selected", () => {
    component.monthSelected.subscribe((month: number) => {
      expect(month).toEqual(0);
    });
    component.selectMonth(0);
  });
  
  
  
  it("should detect if the month is not equal to the current month", () => {
    let month = new Date().setMonth(new Date().getMonth() + 1);
    expect(component.isCurrentMonth(month)).toEqual(false);
  });
  
  it("should format the month correctly", () => {
    let month = 0;
    expect(component.formatMonthToReadable(month)).toEqual("January");
  });
  
  it("should fail safe if invalid month is set", () => {
    let month = 13;
    expect(component.formatMonthToReadable(month)).toEqual("February");
  });

});
