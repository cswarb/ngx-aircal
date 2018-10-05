import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAircalComponent } from './ngx-aircal.component';

describe('NgxAircalComponent', () => {
  let component: NgxAircalComponent;
  let fixture: ComponentFixture<NgxAircalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxAircalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxAircalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
