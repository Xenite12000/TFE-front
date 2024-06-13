import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { LoadingComponent } from '../../composants/loading/loading.component';



@Component({
  selector: 'app-calendriereleve',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    FullCalendarModule,
    HttpClientModule,
    LoadingComponent,
    FormsModule
  ],
  templateUrl: './calendriereleve.component.html',
  styleUrl: './calendriereleve.component.css'
})
export class CalendriereleveComponent implements OnInit {
  loading: boolean = false;

  user_actual: any;
  user_complete: any;
  club_complete: any;

  calendarOptions: CalendarOptions | undefined;
  date_click: boolean = false;

  lessons: any;
  lesson_tempo: any;
  lessons_calendar: Array<any> = [];
  nb_lessons: any;

  day_clicked: any = {
    day: '01',
    month: '01',
    year: '2024'
  }
  day_selected: any = [{
    date_of: ''
  }]




  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ){
    if (isPlatformBrowser(this.platformId)) {
      this.calendarOptions = {
        initialView: "dayGridMonth",
        plugins: [
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
          listPlugin
        ],
        events: this.lessons_calendar,
        dateClick: (arg) => this.handleDateClick(arg)
      };
    }
  }

  ngOnInit(): void {
    this.loading = true;
    let lesson_param;
    let divide_date;


    this.route.queryParams.subscribe(params => {
      this.user_actual = params['user'];
    });

    this.httpClient.get('http://localhost:8000/api/users/'+ this.user_actual).subscribe( data => {
      this.user_complete = data;
      this.user_complete = {
        firstname: this.user_complete['firstname'],
        lastname: this.user_complete['lastname'],
        club: this.user_complete['club']
      };

      this.httpClient.get('http://localhost:8000' + this.user_complete.club[0]).subscribe( data => {
        this.club_complete = data;

        this.club_complete = {
          id: this.club_complete['id'],
          name: this.club_complete['name'],
          communications: this.club_complete['communications'],
          lessons: this.club_complete['lessons'],
          users: this.club_complete['users']
        };

        this.nb_lessons = this.club_complete.lessons.length;
        this.lessons = [];

        this.club_complete.lessons.forEach((lesson: any) => {
          
          this.httpClient.get('http://localhost:8000' + lesson).subscribe( data =>{
            this.lesson_tempo = data;
            this.lessons.push(data);
            divide_date = this.lesson_tempo.date_of.split('T');
            lesson_param = {
              title: "Cours publique",
              start: divide_date[0],
              backgroundColor: 'green'
            }
            if(this.lesson_tempo.type_lesson == 0) {
              lesson_param = {
                title: "Cours publique",
                start: divide_date[0],
                backgroundColor: 'green'
              }
            } else if(this.lesson_tempo.type_lesson == 1) {
              lesson_param = {
                title: "Cours annulé",
                start: divide_date[0],
                backgroundColor: 'red'
              }
            } else if(this.lesson_tempo.type_lesson == 2) {
              lesson_param = {
                title: "Cours carritatif",
                start: divide_date[0],
                backgroundColor: 'blue'
              }
            } else if(this.lesson_tempo.type_lesson == 3) {
              lesson_param = {
                title: "Cours privé",
                start: divide_date[0],
                backgroundColor: 'purple'
              }
            }
            
            this.lessons_calendar.push(lesson_param);
            this.nb_lessons -= 1;
            if(this.nb_lessons < 1) {
              this.loading = false;
            }
          })
        });

        this.calendarOptions = {
          initialView: "dayGridMonth",
          plugins: [
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            listPlugin
          ],
          events: this.lessons_calendar,
          locale: 'fr',
          dateClick: (arg) => this.handleDateClick(arg)
        };

      });

    });

  }

  handleDateClick(arg: any) {
    let args = arg.dateStr.split('-');
    this.day_clicked = {
      day: args[2],
      month: args[1],
      year: args[0]
    }
    this.day_selected = [];
    this.lessons.forEach((lesson: any) => {
      if(lesson.date_of.includes(arg.dateStr)) {
        this.day_selected.push(lesson);
      }
    });
    this.date_click = true;
  }


}
