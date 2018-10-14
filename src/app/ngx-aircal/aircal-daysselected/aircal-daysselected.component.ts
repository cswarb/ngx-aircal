import { Component, OnInit, Input } from "@angular/core";
import { AircalSelectedTime } from "../ngx-aircal.model";

@Component({
    selector: "[data-aircal-daysselected]",
    templateUrl: "./aircal-daysselected.component.html",
})
export class AircalDaysselectedComponent implements OnInit {
    @Input() numberOfDaysSelected: AircalSelectedTime = new AircalSelectedTime();

    constructor() {

    }

    ngOnInit() {

    }

}