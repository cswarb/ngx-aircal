import { Component, OnInit, OnDestroy, Output, Input } from "@angular/core";
import { Subject } from "rxjs";
import { AircalUtils } from "../ngx-aircal-util.model";

@Component({
    selector: "[data-aircal-month-quickset]",
    templateUrl: "./aircal-month-quickset.component.html",
    styleUrls: ["./aircal-month-quickset.component.scss"]
})
export class AircalMonthQuicksetComponent implements OnInit, OnDestroy {
    @Input() monthChoices: Array<number> = [];
    @Input() date: Date = new Date();
    @Output() monthSelected: Subject<number> = new Subject();

    constructor() {

    }

    ngOnDestroy() {
        this.monthSelected.unsubscribe();
    }

    ngOnInit() {

    }

    public formatMonthToReadable(month: number) {
        return AircalUtils.formatMonthToReadable(month);
    }

    public isCurrentMonth(month: number): boolean {
        return AircalUtils.isCurrentMonth(this.date, month);
    }

    public selectMonth(month: number) {
        this.monthSelected.next(month);
    }

}