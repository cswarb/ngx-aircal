import { Component, OnInit, Input } from "@angular/core";
import { format } from "date-fns";
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
        return date ? format(date.day, "D") : "";
    }

}