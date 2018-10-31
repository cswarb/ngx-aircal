import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircalSelectComponent } from './aircal-select.component';

describe('AircalSelectComponent', () => {
  let component: AircalSelectComponent;
  let fixture: ComponentFixture<AircalSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircalSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircalSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
