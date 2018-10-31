import { Component, OnInit, Output, Input, OnDestroy } from "@angular/core";
import { AircalOptions, AircalModel } from "../ngx-aircal.model";
import { Subject } from "rxjs";

@Component({
    selector: "[data-aircal-select]",
    templateUrl: "./aircal-select.component.html",
    styleUrls: ["./aircal-select.component.css"]
})
export class AircalSelectComponent implements OnInit, OnDestroy {
    @Input() selectionShortcuts = new AircalOptions().selectionShortcuts;
    @Input() selectedStartDate: Date | null = null;
    @Output() selectionShortcutChanged: Subject<string> = new Subject();

    //Helpers
    public ObjectKeys: Function = Object.keys;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.selectionShortcutChanged.unsubscribe();
    }

    public onChange(evt: string) {
        this.selectionShortcutChanged.next(evt);
    }

}