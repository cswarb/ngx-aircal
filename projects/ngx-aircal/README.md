# ngx-aircal

![version](https://img.shields.io/npm/v/ngx-aircal.svg?colorB=00a699)
![license](https://img.shields.io/github/license/cswarb/ngx-aircal.svg?colorB=00a699)
![weight](https://img.shields.io/bundlephobia/minzip/ngx-aircal.svg?colorB=00a699)
![build](https://img.shields.io/travis/cswarb/ngx-aircal.svg?colorB=00a699)

![Aircal](/projects/ngx-aircal/aircal.png?raw=true "Aircal")

## Description
ngx-aircal is a modern, configurable and lightweight Angular date range picker.

## Notes

- When setting the dateFormat option, be aware that you must use [Unicode tokens](https://date-fns.org/v2.0.0-alpha.27/docs/Unicode-Tokens)

## How do I install the library?

To install this component to an external project, follow the procedure:

```
npm install ngx-aircal --save
```

## How do I import the calendar?
Add 'NgxAircalModule' module to your imports array in your module

```ts
import { NgxAircalModule } from "ngx-aircal";
```

```ts
@NgModule({
  imports: [
     ...,
    NgxAircalModule
})
```

## How do I use the calendar?

Add the following to your html template. ngx-aircal uses a data attribute selector to keep your HTML valid:

```html
<div data-ngx-aircal [options]="calendarOptions" 
    name="dateRange" 
    [(ngModel)]="dateRange"
    (onDateRangeCommitted)="onDateRangeCommitted($event)" 
    (onDateRangeChanged)="onDateRangeChanged($event)"
    (onCalendarViewChanged)="onCalendarViewChanged($event)" 
    (onInputFieldChanged)="onInputFieldChanged($event)"
    (onDateRangeInitialised)="onDateRangeInitialised($event)"
    (onDateRangeCleared)="onDateRangeCleared($event)">
</div>
```

### Options

Initialise an options object as a component property. Now, pass this to the calendar component:

```ts
import { AircalOptions } from "ngx-aircal";
```

```ts
export class AppComponent {
    ...
    public calendarOptions: AircalOptions = new AircalOptions();
    ...
}
```

You can update options by passing an object into the constructor:

```ts
export class AppComponent {
    ...
    public calendarOptions: AircalOptions = new AircalOptions({
      inlineMode: true,
      daysSelectedCounterVisible: false
    });
    ...
}
```


| Option name | Default value | Type | Description |
| ------------- | ------------- | ----- | --- |
| defaultStart | new Date() | Date | Set the default start view when the calendar is opened |
| inlineMode | false | Boolean | Display the calendar without the input field |
| disable | false | Boolean | Disable the ability to set the date and apply it |
| singlePicker | false | Boolean | Use a single range picker instead of a double to save space |
| startDate | null | Date | Set a starting date. If no end is provided, then the datepicker will be in highlighted mode on the UI, ready for an end date selection. |
| endDate | null | Date | Set an end date. If no start date is set, it will fall back to become the start date. |
| dayLabels | new AircalDayLabels() | AircalDayLabels | Set the label values for each day of the week |
| selectionShortcuts | { "7.days": "7 Days", "14.days": "14 Days", "1.months": "1 Month", "6.months": "6 Months", "1.years": "1 Year" } | Object | Options and values to pass to the quick selection component when _selectionShortcutVisible_ is true. Key is the value parsed by the plugin, and the value is what is shown in the input dropdown. Separate the key length and duration values by a '.'. It can parse different durations. e.g. "7.weeks": "7 Weeks" |
| dateFormat | "dd/MM/yyyy" | String | Format the date displayed in the input, and given in the callback response. Format is Unicode Technical Standard #35. Uses date-fns library to format the dates. When setting the dateFormat option, be aware that you must use [Unicode tokens](https://date-fns.org/v2.0.0-alpha.27/docs/Unicode-Tokens) |
| previousMonthWrapAround | true | Boolean | Should dates be shown in the previous month spaces |
| nextMonthWrapAround | true | Boolean | Should dates be shown in the next month spaces |
| daysSelectedCounterVisible | true | Boolean | Should the calendar display the number of days selected |
| selectionShortcutVisible | false | Boolean | Should the range shortcut be visible |
| backgroundVisible | true | Boolean | Make the background transparent |
| width | "" | String | Overwrite the width set in the css |
| height | "" | String | Overwrite the width set in the css |
| applyText | "Apply" | String | Change the text to commit the date range |
| autoApplyAndClose | false | Boolean | When an end date is selected (or a start date if a start and end already exist), automatically apply the date selection and close the calendar |
| includeExamplePlaceholder | true | Boolean | Show an placeholder example for the input field. Dynamically generates example dates based on _dateFormat_ option |
| autoCloseWhenApplied | false | Boolean | Close the calendar when the apply button is pressed |
| clearText | "Clear" | String | Change the text to clear the date range |
| highlightToday | true | Boolean | Highlight the cell colour for today |
| showClearBtn | true | Boolean | Should the clear button be shown on the UI |
| showApplyBtn | true | Boolean | Should the apply button be shown on the UI |
| minYear | 1000 | Number | The minimum year selectable |
| maxYear | 9999 | Number | The maximum year selectable |
| disablePreviousSelection | false | Boolean | Disable the previous selection arrow |
| disableForwardSelection | false | Boolean | Disable the next selection arrow |
| disableFromHereBackwards | null | Date | Disable the cells from being selected from the date supplied going backwards |
| disableFromHereForwards | null | Date | Disable the cells from being selected from the date supplied going forwards |
| indicateInvalidDateRange | true | Boolean | Indicate whether or not to show the red border on the input field |
| hasArrow | true | Boolean | Should the calendar have the arrow pointer |
| arrowBias | "left" | arrowBias | What edge should the arrow display on |
| calendarPosition | calendarBias | "bottom" | Where does the calendar display in relation to the input |
| allowQuicksetMonth | false | Boolean | Allow the quick selection on months by clicking the month |
| allowQuicksetYear | false | Boolean | Allow the quick selection of years by clicking the year |
| allowUserInputField | true | Boolean | Should the default view be an input field, or just a button that contains text |
| allowInfiniteEndDate | false | Boolean | Allow no end date to be set |
| closeOnOutsideClick | false | Boolean | Allow the calendar to be closed by clicking outside the component |
| icons | {leftArrow: null, rightArrow: null } | { leftArrow?: null \| string, rightArrow?: null \| string } | Option to provide a base64 image to replace the existing arrows on the main calendar |

## Models

You can use ngModel or a reactive form to work with the calendar.

### ngModel

Define an object with 2 props, __startDate__, and __endDate__. Both properties must be of type 'Date'.

```ts
ngOnInit() {
	this.dateRange = {
    startDate: new Date(
      2018,
      6,
      27
    ), 
    endDate: new Date(
      2018,
      8,
      27
    )
  };
}
```

Your should pass in the object into the ngModel _box of bananas_ on your template:

```html
<div data-ngx-aircal [options]="calendarOptions" [(ngModel)]="dateRange"></div>
```

### Reactive forms

```ts
ngOnInit() {
  this.form = this._FormBuilder.group({
    dateRange: [{
      startDate: new Date(
        2018,
        6,
        27
      ),
      endDate: new Date(
        2018,
        8,
        27
      )
    }, Validators.required]
  }); 
}
```

Add the following inside your template:

```html
<form [formGroup]="myForm">
    <div data-ngx-aircal [options]="calendarOptions" formControlName="dateRange"></div>
</form>
```

## Events, callbacks &amp; responses

There are many callbacks you can use to communicate with your parent component. A full list of callbacks is below.

```html
<div data-ngx-aircal [options]="calendarOptions" 
    name="dateRange" 
    [(ngModel)]="dateRange"
    (onDateRangeCommitted)="onDateRangeCommitted($event)" 
    (onDateRangeChanged)="onDateRangeChanged($event)"
    (onCalendarViewChanged)="onCalendarViewChanged($event)" 
    (onInputFieldChanged)="onInputFieldChanged($event)"
    (onDateRangeInitialised)="onDateRangeInitialised($event)"
    (onDateRangeCleared)="onDateRangeCleared($event)">
</div>
```

Note the event name, and the provided callback function, which takes in $event as a parameter:

```html
(onDateRangeCommitted)="onDateRangeCommitted($event)"
```

The plugin will respond with a specific set of properties - either:

```ts
class AircalResponse {
    public startDate: Date;
    public endDate: Date;
    public formattedStartDate: string;
    public formattedEndDate: string;
}

class AircalInputResponse {
    public startDate: Date;
    public endDate: Date;
    public formattedStartDate: string;
    public formattedEndDate: string;
    public isRangeValid: boolean;
}
```

Example usage:

```ts
public onDateRangeChanged(event: AircalResponse) {
	this.updatePageResults(event.startDate, event.endDate);
}
```

##### List of callbacks

All callbacks will return __AircalResponse__ or __AircalInputResponse__ type. __AircalInputResponse__ has an extra boolean value to show you if the date is valid.

| Callback name | Response type | Description |
| ------------- | ------------- | ----- |
| onDateRangeCommitted | AircalResponse | When the range is committed by the user. Normally by the apply button, but in case __showApplyBtn__ is false, it will respond automatically when the end date is selected |
| onDateRangeChanged | AircalResponse | When the start or end date is changed by the user. |
| onCalendarViewChanged | AircalResponse | When the view is changed left or right using the arrows |
| onInputFieldChanged  | AircalInputResponse | When the user modifies the input field. |
| onDateRangeInitialised  | AircalResponse | As soon as the component initialises, a response will be returned for consistency. |
| onDateRangeCleared  | AircalResponse | When the __showClearBtn__ option is true, and the user presses the button, a response will be returned. |

## Author
* Author: Chris Swarbrick (chrisswarb)

## Credit
* Icons by Dave Gandy and Lyolya from www.flaticon.com