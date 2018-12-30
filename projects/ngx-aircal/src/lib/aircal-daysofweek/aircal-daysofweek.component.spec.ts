import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AircalDaysofweekComponent } from "./aircal-daysofweek.component";
import { AircalDayLabels } from "../ngx-aircal.model";

describe("AircalDaysofweekComponent", () => {
  let component: AircalDaysofweekComponent;
  let fixture: ComponentFixture<AircalDaysofweekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircalDaysofweekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircalDaysofweekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  
  it("should default dayLabels prop to an AircalDayLabels instance", () => {
    expect(component.dayLabels).toEqual(new AircalDayLabels());
  });
  
  it("should default dayName prop to an empty string", () => {
    expect(component.dayName).toBeFalsy();
    expect(component.dayName).toEqual("");
  });
});
