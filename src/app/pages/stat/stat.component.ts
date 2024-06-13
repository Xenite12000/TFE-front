import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../composants/loading/loading.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    LoadingComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.css'
})
export class StatComponent implements OnInit {
  today: string | null;
  auj: string = '2024-01-01';
  total: number = 0;
  year: any;
  months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  loading: boolean = false;

  user_complete: any;
  club_complete: any;
  user_actual: any;

  user_tempo: any;
  lesson_tempo: any;
  nb_users: any;
  nb_lessons: any;

  users_club: any = [
  ];
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
        club: this.user_complete['club']
      };
      this.httpClient.get('http://localhost:8000' + this.user_complete['club'][0]).subscribe( data => {
        this.club_complete = data;
        this.club_complete = {
          id: this.club_complete['id'],
          name: this.club_complete['name'],
          localisation: this.club_complete['localisation'],
          lessons: this.club_complete['lessons'],
          users: this.club_complete['users']
        };

        this.nb_users = this.club_complete['users'].length;
        this.club_complete['users'].forEach((user_url: any) => {
      
          this.httpClient.get('http://localhost:8000' + user_url).subscribe( data => {
            this.user_tempo = data;
            this.user_tempo.nb_presence = 0;
            this.users_club.push(this.user_tempo);

            this.nb_users -= 1;
            if(this.nb_users < 1) {
              this.loading = false;
              this.StatAn();
            }
          });
        });

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
    
    this.nb_lessons = this.club_complete.lessons.length;
    this.lessons = [];
    this.months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.users_club.forEach((user_reset: any) => {
      user_reset.nb_presence = 0;
    });

    this.club_complete.lessons.forEach((lesson: any) => {
      
      this.httpClient.get('http://localhost:8000' + lesson).subscribe( data =>{
        this.lesson_tempo = data;
        if(this.lesson_tempo.date_of.split('T')[0].split('-')[0] == this.StatForm.value.annee) {
          this.lessons.push(this.lesson_tempo);
          if(this.lesson_tempo.users.length != 0) {
            this.lesson_tempo.users.forEach((lesson_for_now: any) => {
              let user_to_add = this.users_club.find((user: any) => user['@id'] === lesson_for_now)
              if(user_to_add) {
                user_to_add.nb_presence += 1
              }
              this.total += 1;
              this.months[+this.lesson_tempo.date_of.split('T')[0].split('-')[1] - 1] += 1;
            });
          }
        }
        this.nb_lessons -= 1;
        if(this.nb_lessons < 1) {
          this.loading = false;
        }
      })
    });
   
  }

  generateExcelFile() {
    const testlist = [
      {Year: this.year},
      {Month: 'janvier', Presence: this.months[0]},
      {Month: 'février', Presence: this.months[1]},
      {Month: 'mars', Presence: this.months[2]},
      {Month: 'avril', Presence: this.months[3]},
      {Month: 'mai', Presence: this.months[4]},
      {Month: 'juin', Presence: this.months[5]},
      {Month: 'juillet', Presence: this.months[6]},
      {Month: 'août', Presence: this.months[7]},
      {Month: 'septembre', Presence: this.months[8]},
      {Month: 'ovtobre', Presence: this.months[9]},
      {Month: 'novembre', Presence: this.months[10]},
      {Month: 'décembre', Presence: this.months[11]},
      {Month: 'Total', Presence: this.total}
    ]

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(testlist);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FeuilleTest');
    const excelBuff = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    const excelBlob = new Blob([excelBuff], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    saveAs(excelBlob, 'testsport.xlsx');
  }
}
