import { Component } from '@angular/core';
import { CalendarComponent } from '../../composants/calendar/calendar.component';

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [
    CalendarComponent
  ],
  templateUrl: './calendrier.component.html',
  styleUrl: './calendrier.component.css'
})
export class CalendrierComponent {

}
