import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../composants/loading/loading.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { send } from 'node:process';

@Component({
  selector: 'app-eleves',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    LoadingComponent,
    ReactiveFormsModule
  ],
  templateUrl: './eleves.component.html',
  styleUrl: './eleves.component.css'
})
export class ElevesComponent implements OnInit{

  user_complete: any;
  club_complete: any;

  loading: boolean = false;
  detail: boolean = false;

  users_club: any = [
  ];
  users: any = [
  ];
  user_to_show: any = {
    id: 0,
    firstname: '',
    lastname: '',
    seance_left: 0,
    mail: '',
    tel_number: ''
  }
  nb_users: any;

  user_tempo: any;
  user_actual: any;

  searchForm = new FormGroup({
    search: new FormControl('')
  });

  seanceForm = new FormGroup({
    seance_number: new FormControl('')
  });

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
          communications: this.club_complete['communications'],
          users: this.club_complete['users']
        };
        this.nb_users = this.club_complete['users'].length;
        this.club_complete['users'].forEach((user_url: any) => {
          
          this.httpClient.get('http://localhost:8000' + user_url).subscribe( data => {
            this.user_tempo = data;
            if(this.user_tempo.roles[0] != "ROLE_ADMIN") {
              this.users_club.push(this.user_tempo);
            }

            this.nb_users -= 1;
            if(this.nb_users < 1) {
              this.users = this.users_club;
              this.loading = false;
            }
           
          });
        });


      });

    });

  }

  Searching() {
    if(typeof this.searchForm.value.search == 'string') {
      this.recherche(this.searchForm.value.search);
    }
  }


  recherche(rech: string) {
    this.users = [];
    this.users_club.forEach((user: any) => {
      if(user.firstname.includes(rech) || user.lastname.includes(rech)) {
        this.users.push(user);
      }
    });
    
  }

  choixUser(user_selected: any) {
    this.detail = true;
    this.user_to_show = user_selected;
  }

  AddSeances() {
    console.log(this.seanceForm.value.seance_number);
    let seances = this.user_to_show.seance_left + this.seanceForm.value.seance_number;
    const formSeances = {
      "seance_left": seances
    }


    if (seances != this.user_to_show.seance_left) {
      this.httpClient.patch('http://localhost:8000/api/users/' + this.user_to_show.id, formSeances, {
        headers: new HttpHeaders({
          'Content-Type': 'application/merge-patch+json'
        })
      }).subscribe(
        response => {
          this.detail = false;
        },
        error => console.error(error)
      );
    }
    
  }
}
