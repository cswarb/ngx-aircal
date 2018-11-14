# ngx-aircal

This plugin is still in development

## Description
ngx-aircal is a modern, configurable and lightweight Angular date range picker.

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
}
```

Add the following inside your template:

```html
<form [formGroup]="myForm">
    <div data-ngx-aircal [options]="calendarOptions" formControlName="dateRange"></div>
</form>
```

## Events, callbacks &amp; responses

There are many callbacks you can use to communicate with your parent component.

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


The plugin will respond with a specific set of properties:

```ts
class AircalResponse {
    public startDate: Date;
    public endDate: Date;
    public formattedStartDate: string;
    public formattedEndDate: string;
}

```

Example usage:

```ts
public onDateRangeChanged(event: AircalResponse) {
	this.updatePageResults(event.startDate, event.endDate);
}
```

## Author
* Author: Chris Swarbrick (chrisswarb)
