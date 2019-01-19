import { Component, OnInit, Input, Output, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { AircalUtils } from "../ngx-aircal-util.model";

@Component({
    selector: "[data-aircal-year-quickset]",
    templateUrl: "./aircal-year-quickset.component.html",
    styleUrls: ["./aircal-year-quickset.component.scss"]
})
export class AircalYearQuicksetComponent implements OnInit, OnDestroy {
    @Input() yearChoices: Array<number> = [];
    @Input() date: Date = new Date();
    @Input() minYear: number = null;
    @Input() maxYear: number = null;

    @Output() yearSelected: Subject<number> = new Subject();
    @Output() nextYearChunks: Subject<boolean> = new Subject();
    @Output() prevYearChunks: Subject<boolean> = new Subject();
    
    constructor() {

    }

    ngOnInit() {

    }
    
    ngOnDestroy() {
        this.yearSelected.unsubscribe();
        this.nextYearChunks.unsubscribe();
        this.prevYearChunks.unsubscribe();
    }

    public getNextYearChunks() {
        this.nextYearChunks.next(true);
    }

    public getPrevYearChunks() {
        this.prevYearChunks.next(true);
    }
    
    public isCurrentYear(year: number) {
        return AircalUtils.isCurrentYear(this.date, year);
    }
    
    public isCurrentYearViable(year: number) {
        return AircalUtils.isCurrentYearViable(year, this.minYear, this.maxYear);
    }

    public selectYear(year: number) {
        if(this.isCurrentYearViable(year)) {
            this.yearSelected.next(year);
        };
    }

}