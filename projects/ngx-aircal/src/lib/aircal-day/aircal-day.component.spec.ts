import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircalDayComponent } from './aircal-day.component';

describe('AircalDayComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
