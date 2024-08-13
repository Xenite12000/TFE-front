import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../composants/loading/loading.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-profileleve',
  standalone: true,
  imports: [
    HttpClientModule,
    LoadingComponent,
    CommonModule,
    ReactiveFormsModule,
    QRCodeModule
  ],
  templateUrl: './profileleve.component.html',
  styleUrl: './profileleve.component.css'
})
export class ProfileleveComponent {
  loading: boolean = false;
  modify: boolean = false;
  formatmail: boolean = false;
  formatnumber: boolean = false;
  qrcode: boolean = false;

  user_complete: any;
  club_complete: any;
  nb_clubs: any;
  clubs_list: any = [];
  nblessons: any = 0;
  badge: any = "../../../assets/successicon/comeone.svg";

  user_actual: any;
  club_tempo: any;

  public myAngularxQrCode: string = '0';

  changeUserForm = new FormGroup({
    mail: new FormControl('', [Validators.email]),
    tel_number: new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])
  });


  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
    this.myAngularxQrCode = '0';

  }

  ngOnInit(): void {
    this.loading = true;

    this.route.queryParams.subscribe(params => {
      this.user_actual = params['user'];
    });

    this.httpClient.get('http://localhost:8000/api/users/'+ this.user_actual).subscribe( data => {
      this.user_complete = data;

      this.nblessons = this.user_complete.lessons.length;

      if(this.nblessons > 99) {
        this.badge = "../../../assets/successicon/comehundred.svg";
      } else if(this.nblessons > 49) {
        this.badge = "../../../assets/successicon/comefifty.svg";
      } else if(this.nblessons > 24) {
        this.badge = "../../../assets/successicon/cometwentyfive.svg";
      } else if(this.nblessons > 9) {
        this.badge = "../../../assets/successicon/cometen.svg";
      } else {
        this.badge = "../../../assets/successicon/comeone.svg";
      }

      this.user_complete = {
        id: this.user_complete['id'],
        firstname: this.user_complete['firstname'],
        lastname: this.user_complete['lastname'],
        mail: this.user_complete['mail'],
        club: this.user_complete['club'],
        tel_number: this.user_complete['tel_number'],
      };

      this.myAngularxQrCode = String(this.user_complete['id']);


      this.httpClient.get('http://localhost:8000' + this.user_complete.club[0]).subscribe( data => {
        this.club_complete = data;
        this.club_complete = {
          id: this.club_complete['id'],
          name: this.club_complete['name'],
          localisation: this.club_complete['localisation'],
          communications : this.club_complete['communications']
        };
        
        this.nb_clubs = this.user_complete.club.length;

        this.user_complete.club.forEach((club: any) => {
          this.httpClient.get('http://localhost:8000' + club).subscribe( data => {
            this.club_tempo = data;
            this.club_tempo = {
              id: this.club_tempo.id,
              name: this.club_tempo.name,
              localisation: this.club_tempo.localisation
            }
            this.clubs_list.push(this.club_tempo);
            this.nb_clubs -= 1;
            if(this.nb_clubs < 1) {
              this.loading = false;
            }
          })
        });
      });
    });

  }


  changeUser() {
    if(this.changeUserForm.value.mail == this.user_complete.mail && this.changeUserForm.value.tel_number == this.user_complete.tel_number) {
      this.modify = false;
    } else if(this.changeUserForm.controls.mail.errors) {
      this.formatmail = true;
    } else if(this.changeUserForm.controls.tel_number.errors) {
      this.formatnumber = true;
    } else {
      this.formatmail = false;
      this.formatnumber = false;

      let userForm = {
        mail: this.user_complete.mail,
        tel_number: this.user_complete.tel_number
      }

      if(this.changeUserForm.value.mail != this.user_complete.mail && this.changeUserForm.value.mail != '') {
        userForm.mail = this.changeUserForm.value.mail;
      }
      if(this.changeUserForm.value.tel_number != this.user_complete.tel_number && this.changeUserForm.value.tel_number != '') {
        userForm.tel_number = this.changeUserForm.value.tel_number;
      }
      console.log(userForm.mail + userForm.tel_number);

      this.httpClient.patch('http://localhost:8000/api/users/' + this.user_complete.id, userForm, {
        headers: new HttpHeaders({
          'Content-Type': 'application/merge-patch+json'
        })
      }).subscribe(
        response => {
          this.user_complete.mail = userForm.mail;
          this.user_complete.tel_number = userForm.tel_number;
          this.modify = false;
        },
        error => console.error(error)
      );
    }
  }

}
