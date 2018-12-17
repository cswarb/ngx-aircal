import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircalYearQuicksetComponent } from './aircal-year-quickset.component';

describe('AircalYearQuicksetComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
