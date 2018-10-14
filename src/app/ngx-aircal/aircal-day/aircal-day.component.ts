import { Component, OnInit, Input } from "@angular/core";
import moment = require("moment");

@Component({
    selector: "[data-aircal-day]",
    templateUrl: "./aircal-day.component.html",
    styleUrls: ["./aircal-day.component.css"]
})
export class AircalDayComponent implements OnInit {
    @Input() day: any = moment();
    
    constructor() {

    }

    ngOnInit() {

    }

}