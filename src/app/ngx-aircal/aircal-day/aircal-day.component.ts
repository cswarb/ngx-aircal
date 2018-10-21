import { Component, OnInit, Input } from "@angular/core";
import moment = require("moment");
import { format } from "date-fns";

@Component({
    selector: "[data-aircal-day]",
    templateUrl: "./aircal-day.component.html",
    styleUrls: ["./aircal-day.component.css"]
})
export class AircalDayComponent implements OnInit {
    @Input() day: string = format(new Date(), "D");
    
    constructor() {

    }

    ngOnInit() {

    }

    public getDate(date: Date | null): string {
        return date ? format(date, "D") : "";
    }

}