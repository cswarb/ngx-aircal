import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircalMonthQuicksetComponent } from './aircal-month-quickset.component';

describe('AircalMonthQuicksetComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
