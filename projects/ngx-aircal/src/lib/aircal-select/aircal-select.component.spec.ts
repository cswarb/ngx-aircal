import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AircalSelectComponent } from "./aircal-select.component";
import { Subject } from "rxjs";
import { AircalOptions } from "../ngx-aircal.model";

describe("AircalSelectComponent", () => {
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should default props correctly", () => {
    expect(component.selectionShortcuts).toEqual(new AircalOptions().selectionShortcuts);
    expect(component.selectedStartDate).toEqual(null);
    expect(component.selectionShortcutChanged).toEqual(new Subject());
  });

  it("should trigger a subscriber when shortcut is selected", () => {
    component.selectionShortcutChanged.subscribe((shortcut: string) => {
      expect(shortcut).toEqual("7.days");
    });
    component.onChange("7.days");
  });

});
