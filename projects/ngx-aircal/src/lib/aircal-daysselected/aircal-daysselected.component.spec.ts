import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircalDaysselectedComponent } from './aircal-daysselected.component';

describe('AircalDaysselectedComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
