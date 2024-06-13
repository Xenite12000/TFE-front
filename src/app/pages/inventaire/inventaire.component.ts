import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../composants/loading/loading.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-inventaire',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    HttpClientModule
  ],
  templateUrl: './inventaire.component.html',
  styleUrl: './inventaire.component.css'
})
export class InventaireComponent implements OnInit {

  loading: boolean = false;

  user_actual: any;
  user_complete: any;
  club_complete: any;



  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {

  }

  ngOnInit(): void {
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
          localisation: this.club_complete['localisation'],
          communications : this.club_complete['communications'],

        };

        
      });
    });

  }

}
