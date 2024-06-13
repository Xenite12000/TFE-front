import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../composants/header/header.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { CalendarComponent } from '../../composants/calendar/calendar.component';
import { LoadingComponent } from '../../composants/loading/loading.component';


@Component({
  selector: 'app-accueileleve',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    HttpClientModule,
    CommonModule,
    CalendarComponent,
    LoadingComponent
  ],
  templateUrl: './accueileleve.component.html',
  styleUrl: './accueileleve.component.css'
})
export class AccueileleveComponent implements OnInit {
  user_complete: any;
  club_complete: any;

  loading: boolean = false;

  communications_club: any = [
    {}
  ]
  communications_recap: any = [
    {}
  ]
  com_tempo: any;
  user_actual: any;

  constructor (
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ) {

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

}

