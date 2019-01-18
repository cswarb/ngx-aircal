import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AircalDaysselectedComponent } from "./aircal-daysselected.component";
import { AircalSelectedTime } from "../ngx-aircal-util.model";

describe("AircalDaysselectedComponent", () => {
  let component: AircalDaysselectedComponent;
  let fixture: ComponentFixture<AircalDaysselectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircalDaysselectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircalDaysselectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  
  it("should default numberOfDaysSelected prop to be an instance of AircalSelectedTime", () => {
    expect(component.numberOfDaysSelected).toBeTruthy();
    expect(component.numberOfDaysSelected instanceof AircalSelectedTime).toEqual(true);
    expect(component.numberOfDaysSelected).toEqual(new AircalSelectedTime());
  });
  
  it("should default numberOfDaysSelected prop to be 0 values", () => {
    expect(component.numberOfDaysSelected.days).toEqual(0);
    expect(component.numberOfDaysSelected.months).toEqual(0);
    expect(component.numberOfDaysSelected.years).toEqual(0);
  });
});
