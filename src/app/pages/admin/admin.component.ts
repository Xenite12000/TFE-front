import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../composants/header/header.component';
import { AccueilComponent } from '../accueil/accueil.component';
import { CalendrierComponent } from '../calendrier/calendrier.component';
import { ElevesComponent } from '../eleves/eleves.component';
import { StatComponent } from '../stat/stat.component';
import { CommonModule } from '@angular/common';
import { InventaireComponent } from '../inventaire/inventaire.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LoadingComponent } from '../../composants/loading/loading.component';
import { AccueileleveComponent } from '../accueileleve/accueileleve.component';
import { HeadereleveComponent } from '../../composants/headereleve/headereleve.component';
import { CalendriereleveComponent } from '../calendriereleve/calendriereleve.component';
import { StateleveComponent } from '../stateleve/stateleve.component';
import { ProfileleveComponent } from '../profileleve/profileleve.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    HeaderComponent,
    AccueilComponent,
    CalendrierComponent,
    ElevesComponent,
    StatComponent,
    InventaireComponent,
    CommonModule,
    HttpClientModule,
    LoadingComponent,
    HeadereleveComponent,
    AccueileleveComponent,
    CalendriereleveComponent,
    StateleveComponent,
    ProfileleveComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  loading: boolean = false;
  admin: boolean = false;

  user_complete: any;
  club_complete: any;

  page_selected: string = 'accueileleve';
  user_actual: any;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {

  }

  ngOnInit(): void {
    this.loading = true;

    this.route.queryParams.subscribe(params => {
      this.user_actual = params['user'];
    });

    this.httpClient.get('http://localhost:8000/api/users/'+ this.user_actual).subscribe( data => {
      this.user_complete = data;
      if(this.user_complete.roles[0] == "ROLE_ADMIN") {
        this.admin = true;
        this.page_selected = 'accueil';
      }
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
          localisation: this.club_complete['localisation'],
          communications : this.club_complete['communications']
        };
        this.loading = false;
      });
    });

  }

  page_change(page: string) {
    this.page_selected = page;
  }
}
