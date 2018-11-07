# ngx-aircal

A configurable Angular 4+ calendar.

## How do I install the calendar?

Install through npm:

```npm install ngx-aircal --save```

##### This plugin internally depends on

```date-fns```


## How do I prepare to use the calendar?

Import the plugin in to your Angular module:

```import { NgxAircalModule } from 'ngx-aircal';````

Now, include it in the imports array:

```imports: [
    ...,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NgxAircalModule
  ],```

##### Notes

You will need to include the forms modules to use either ngModel or the FormGroup to setup your calendar instance.


##How do I setup the calendar?

In your component html, reference the ngx-aircal component by adding the attribute 'data-ngx-aircal' onto an element. Make sure to wrap the calendar in a 'form' element.

 You can pass in an options object and subscribe to the events the calendar emits. A full list of options and exposed events are listed below.

```<form (ngSubmit)="submitForm()" novalidate>
  <div data-ngx-aircal [options]="calendarOptions" name="dateRange" [(ngModel)]="dateRange" (onDateRangeCommitted)="onDateRangeCommitted($event)"
    (onDateRangeChanged)="onDateRangeChanged($event)" (onCalendarViewChanged)="onCalendarViewChanged($event)"
    (onInputFieldChanged)="onInputFieldChanged($event)" (onDateRangeInitialised)="onDateRangeInitialised($event)"
    (onDateRangeCleared)="onDateRangeCleared($event)">
  </div>
</form>
```

##What calendar options can i use?



##What calendar events can i subscribe to?