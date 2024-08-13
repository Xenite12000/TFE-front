import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../composants/header/header.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

import { CalendarComponent } from '../../composants/calendar/calendar.component';
import { LoadingComponent } from '../../composants/loading/loading.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { QRCodeModule } from 'angularx-qrcode';



@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    HttpClientModule,
    CommonModule,
    CalendarComponent,
    LoadingComponent,
    ReactiveFormsModule
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  loading: boolean = false;
  addcom: boolean = false;
  erroraddcom: boolean = false;

  today: string | null;

  user_complete: any;
  club_complete: any;


  communications_club: any = [
    {}
  ]
  communications_recap: any = [
    {}
  ]
  com_tempo: any;
  user_actual: any;

  comForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    message: new FormControl(''),
    type_com: new FormControl('', [Validators.required]),
    for_day: new FormControl('')
  })


  constructor (
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    const currentDate = new Date();
    this.today = currentDate.toISOString();

  }

  ngOnInit(): void {
    this.loading = true;
    

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
        communications: this.club_complete['communications']
      };
      this.recup_communications();
    });
    });

  }

  recup_communications() {
    this.communications_club = [];
    this.communications_recap = [];
    this.club_complete['communications'].forEach((communication_url: any) => {
      
      this.httpClient.get('http://localhost:8000' + communication_url).subscribe( data => {
        this.com_tempo = data;
        if(this.com_tempo.type_com == 0) {
          this.communications_club.push(this.com_tempo);
        } else {
          this.communications_recap.push(this.com_tempo);
        }
        
      });
    });
    this.loading = false;
  }


  addCommunication() {
    if(this.comForm.value.for_day == '') {
      this.comForm.value.for_day = this.today;
    }
    if(this.comForm.value.title == '' || this.comForm.value.type_com == '') {
      this.erroraddcom = true;
    } else {
      if(this.comForm.value.type_com == null || this.comForm.value.type_com == undefined) {
        this.comForm.value.type_com = "1";
      }
      this.erroraddcom = false;
      let comData = {
        created_at: this.today,
        title: this.comForm.value.title,
        message: this.comForm.value.message,
        type_com: +this.comForm.value.type_com,
        for_day: this.comForm.value.for_day,
        club: '/api/clubs/' + this.club_complete.id
      };
      this.httpClient.post('http://localhost:8000/api/communications', comData).subscribe(
        response => {
          this.addcom = false;
        },
        error => console.error(error)
      );
    }
  }

}

