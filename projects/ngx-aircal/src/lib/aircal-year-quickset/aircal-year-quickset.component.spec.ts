import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AircalYearQuicksetComponent } from "./aircal-year-quickset.component";
import { Subject } from "rxjs";

describe("AircalYearQuicksetComponent", () => {
  let component: AircalYearQuicksetComponent;
  let fixture: ComponentFixture<AircalYearQuicksetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircalYearQuicksetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircalYearQuicksetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should default props correctly", () => {
    expect(component.yearChoices).toEqual([]);
    expect(component.date.getDate()).toEqual(new Date().getDate());
    expect(component.yearSelected).toEqual(new Subject());
    expect(component.nextYearChunks).toEqual(new Subject());
    expect(component.prevYearChunks).toEqual(new Subject());
  });
  
  it("should trigger a subscriber when next year is selected", () => {
    component.nextYearChunks.subscribe((res: boolean) => {
      expect(res).toEqual(true);
    });
    component.getNextYearChunks();
  });
  
  it("should trigger a subscriber when previous year is selected", () => {
    component.prevYearChunks.subscribe((res: boolean) => {
      expect(res).toEqual(true);
    });
    component.getPrevYearChunks();
  });
  
  it("should trigger a subscriber when year is selected", () => {
    component.yearSelected.subscribe((res: number) => {
      expect(res).toEqual(2020);
    });
    component.selectYear(2020);
  });

  it("should detect if the year is equal to the current month", () => {
    let year = new Date().getFullYear();
    expect(component.isCurrentYear(year)).toEqual(true);
  });

  it("should detect if the year is not equal to the current month", () => {
    let year = new Date().setFullYear(new Date().getFullYear() + 1);
    expect(component.isCurrentYear(year)).toEqual(false);
  });

});
