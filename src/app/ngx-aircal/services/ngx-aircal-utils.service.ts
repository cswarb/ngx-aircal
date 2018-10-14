import { Injectable } from "@angular/core";
import { AIRCAL_CALENDAR_SHORTCUT_SEPARATOR } from "../ngx-aircal.model";

@Injectable()
export class NgxAircalUtilsService {

  constructor() { }

  public isWithinRange(date, cell, selectedStartDate): boolean {
    return date > selectedStartDate && date <= cell;
  }

  public getShortcutStrucutre(shortcut: string): { time: string, unit: any } {
    const shortcutData = shortcut.split(AIRCAL_CALENDAR_SHORTCUT_SEPARATOR);
    return {
      time: shortcutData[0] || "1",
      unit: shortcutData[1] || "days"
    };
  }

}