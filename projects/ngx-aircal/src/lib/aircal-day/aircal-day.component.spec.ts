import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AircalDayComponent } from "./aircal-day.component";
import { DateDisplayModel } from "../ngx-aircal.model";

describe("AircalDayComponent", () => {
  let component: AircalDayComponent;
  let fixture: ComponentFixture<AircalDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircalDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircalDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  
  it("should return a valid default date string for null", () => {
    expect(component.getDate(new DateDisplayModel())).toEqual("");
  });
  
  it("should return a valid date day string given a valid date", () => {
    let date = new DateDisplayModel();
    date.day = new Date(2018, 7, 10);
    expect(component.getDate(date)).toEqual("10");
  });
  
  it("should return an empty string", () => {
    expect(component.getDate(null)).toBeFalsy();
  });
  
  it("Day property should be initialised with a new DateDisplayModel", () => {
    expect(component.day instanceof DateDisplayModel).toBeTruthy();
  });
});
