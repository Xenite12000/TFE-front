import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-calendar',
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
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  loading: boolean = false;
  presence: boolean = false;
  addlessons: boolean = false;
  erroraddlessons: boolean = false;
  care_users: boolean = false;

  user_actual: any;
  user_complete: any;
  club_complete: any;

  calendarOptions: CalendarOptions | undefined;
  date_click: boolean = false;

  lessons: any;
  lesson_tempo: any;
  lessons_calendar: Array<any> = [];
  nb_lessons: any;
  lesson_selected: any;
  info_lesson_selected: any;

  addLessonForm = new FormGroup({
    nbWeek: new FormControl(''),
    hour: new FormControl(''),
    type_lesson: new FormControl('')
  });

  day_clicked: any = {
    day: '01',
    month: '01',
    year: '2024'
  }
  day_selected: any = [{
    date_of: ''
  }]

  users_club: any = [
  ];
  users_presence: any = [
  ];
  users_low_seance: any = [
  ];
  user_tempo: any;


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


        this.club_complete['users'].forEach((user_url: any) => {
      
          this.httpClient.get('http://localhost:8000' + user_url).subscribe( data => {
            this.user_tempo = data;
            if(this.user_tempo.roles[0] == "ROLE_USER") {
              this.users_club.push(this.user_tempo);
            }
            
          });
        });

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

  presencesClick(infos: any) {
    this.users_presence = [];
    this.info_lesson_selected = infos;
    this.lesson_selected = this.day_clicked.day + '/' + this.day_clicked.month + '/' + this.day_clicked.year + ' à ' + infos.date_of.split('T')[1].split('+')[0].split(':')[0] + 'h' + infos.date_of.split('T')[1].split('+')[0].split(':')[1]
    if(infos['users'].length == 0) {
      this.users_club.forEach((eleve: any) => {
        eleve.present = false;
        this.users_presence.push(eleve);
      });
    } else {
      this.users_club.forEach((eleve: any) => {
        if(this.info_lesson_selected['users'].includes(eleve['@id'])) {
          eleve.present = true;
          this.users_presence.push(eleve);
        } else {
          eleve.present = false;
          this.users_presence.push(eleve);
        }
        
      });
    }
    this.presence = true;
    console.log(this.users_club);
  }

  ValidatePresence() {
    this.loading = true;
    this.users_low_seance = [];
    
    this.users_presence.forEach((user_to_verif: any) =>{
      if(user_to_verif.present) {
        if(!this.info_lesson_selected['users'].includes(user_to_verif['@id'])) {
          user_to_verif['seance_left'] -= 1;
          if(user_to_verif['seance_left'] < 4) {
            this.users_low_seance.push(user_to_verif);
          }

          this.httpClient.patch('http://localhost:8000' + user_to_verif['@id'], {
            seance_left: user_to_verif['seance_left']
          }, {
            headers: new HttpHeaders({
              'Content-Type': 'application/merge-patch+json'
            })
          }).subscribe(
            response => {
              console.log(response);
            },
            error => console.error(error)
          );
          this.info_lesson_selected['users'].push(user_to_verif['@id']);
        }
      } else {
        if(this.info_lesson_selected['users'].includes(user_to_verif['@id'])) {
          console.log(user_to_verif);
          user_to_verif['seance_left'] += 1;
          console.log(user_to_verif);
          this.httpClient.patch('http://localhost:8000' + user_to_verif['@id'], {
            seance_left: user_to_verif['seance_left']
          }, {
            headers: new HttpHeaders({
              'Content-Type': 'application/merge-patch+json'
            })
          }).subscribe(
            response => {
              console.log(response);
            },
            error => console.error(error)
          );

          this.info_lesson_selected['users'] = this.info_lesson_selected['users'].filter((element: any) => element !== user_to_verif['@id']);
        }
      }

      this.httpClient.patch('http://localhost:8000' + this.info_lesson_selected['@id'], {
        users: this.info_lesson_selected['users']
      }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/merge-patch+json'
        })
      }).subscribe(
        response => {
          this.presence = false;
          this.loading = false;
          if(this.users_low_seance.length > 0) {
            this.care_users = true;
          }
        },
        error => console.error(error)
      );

    })
    
  }


  

  createLesson() {
    if(this.addLessonForm.value.nbWeek == '') {
      if(this.addLessonForm.value.hour != '' && this.addLessonForm.value.type_lesson != '' && this.addLessonForm.value.type_lesson != undefined) {
        let new_lesson = {
          "club": "/api/clubs/" + this.club_complete.id,
          "date_of": this.day_clicked.day + '-' + this.day_clicked.month + '-' + this.day_clicked.year + 'T' + this.addLessonForm.value.hour,
          "type_lesson": +this.addLessonForm.value.type_lesson
        }

        this.httpClient.post('http://localhost:8000/api/lessons', new_lesson).subscribe(
          response => {
            this.addlessons = false;
            this.erroraddlessons = false; 
          },
          error => console.error(error)
        );
      } else {
        this.erroraddlessons = true; 
      }
      
      
      console.log(this.addLessonForm.value.hour);
    } else {
      console.log('pas vide');
    }
    
  }


}
