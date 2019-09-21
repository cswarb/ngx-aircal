import { Component, OnInit, Input } from "@angular/core";
import { format, isValid } from "date-fns";
import { DateDisplayModel } from "../ngx-aircal-util.model";

@Component({
    selector: "[data-aircal-day]",
    templateUrl: "./aircal-day.component.html",
    styleUrls: ["./aircal-day.component.css"]
})
export class AircalDayComponent implements OnInit {
    @Input() day: DateDisplayModel = new DateDisplayModel();
    
    constructor() {

    }

    ngOnInit() {

    }

    public getDate(date: DateDisplayModel | null): string {
        if (date && date.day) {
            return isValid(date.day) ? format(date.day, "d", { useAdditionalDayOfYearTokens: true, useAdditionalWeekYearTokens: true }) : "";             
        };
        return "";
    }

}