import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircalDaysofweekComponent } from './aircal-daysofweek.component';

describe('AircalDaysofweekComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
