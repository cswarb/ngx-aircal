import { Component, OnInit, Input } from "@angular/core";
import { AircalDayLabels } from "../ngx-aircal-util.model";

@Component({
    selector: "[aircal-aircal-daysofweek]",
    templateUrl: "./aircal-daysofweek.component.html",
    styleUrls: ["./aircal-daysofweek.component.css"]
})
export class AircalDaysofweekComponent implements OnInit {
    @Input() dayLabels: AircalDayLabels = new AircalDayLabels();
    @Input() dayName: string = "";

    //Helpers
    public ObjectKeys: Function = Object.keys;

    constructor() {

    }

    ngOnInit() {

    }

}