import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../composants/loading/loading.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-stateleve',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    LoadingComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './stateleve.component.html',
  styleUrl: './stateleve.component.css'
})
export class StateleveComponent implements OnInit {
  today: string | null;
  auj: string = '2024-01-01';
  total: number = 0;
  year: any;
  months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  loading: boolean = false;

  user_complete: any;
  club_complete: any;
  user_actual: any;

  lesson_tempo: any;
  nb_lessons: any;

  lessons: any;

  StatForm = new FormGroup({
    annee: new FormControl('')
  })

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {

    const currentDate = new Date();
    this.today = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  }


  ngOnInit(): void {
    this.loading = true;
    
    if(this.today != null) {
      this.auj = this.today;
    }

    this.route.queryParams.subscribe(params => {
      this.user_actual = params['user'];
    });

    this.httpClient.get('http://localhost:8000/api/users/'+ this.user_actual).subscribe( data => {
      this.user_complete = data;
      this.user_complete = {
        firstname: this.user_complete['firstname'],
        lastname: this.user_complete['lastname'],
        club: this.user_complete['club'],
        lessons: this.user_complete['lessons']
      };

      this.httpClient.get('http://localhost:8000' + this.user_complete['club'][0]).subscribe( data => {
        this.club_complete = data;
        this.club_complete = {
          id: this.club_complete['id'],
          name: this.club_complete['name'],
          localisation: this.club_complete['localisation'],
          lessons: this.club_complete['lessons']
        };
        this.StatAn();
      });

    });


  }


  StatAn() {
    this.loading = true;
    this.total = 0;
    if(this.StatForm.value.annee) {
      this.year = this.StatForm.value.annee;
    } else {
      this.StatForm.value.annee = this.auj.split('-')[0];
      this.year = this.StatForm.value.annee;
    }
    
    this.nb_lessons = this.user_complete.lessons.length;
    this.lessons = [];
    this.months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.user_complete.nb_presence = 0;

    this.user_complete.lessons.forEach((lesson: any) => {
      
      this.httpClient.get('http://localhost:8000' + lesson).subscribe( data =>{
        this.lesson_tempo = data;
        if(this.lesson_tempo.date_of.split('T')[0].split('-')[0] == this.StatForm.value.annee) {
          this.lessons.push(this.lesson_tempo);
          this.months[+this.lesson_tempo.date_of.split('T')[0].split('-')[1] - 1] += 1;
          this.total += 1;
        }
        this.nb_lessons -= 1;
        if(this.nb_lessons < 1) {
          this.loading = false;
        }
      })
    });
   
  }

}
