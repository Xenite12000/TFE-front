import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  confirmation: boolean = false;

  clubs: any;

  constructor (
    private httpClient: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.httpClient.get('http://localhost:8000/api/clubs').subscribe( data => {
      this.clubs = data;
      this.clubs = this.clubs['hydra:member'];
    });
  }


  RegisterForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmation: new FormControl('', [Validators.required]),
    club: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    tel_number: new FormControl('')
  });

  onSubmit() {
    if(this.RegisterForm.value.password != this.RegisterForm.value.confirmation) {
      this.confirmation = true;
    } else {
      this.confirmation = false;
      const formData = {
        "mail": this.RegisterForm.value.email,
        "password": this.RegisterForm.value.password,
        "roles": ["ROLE_USER"],
        "firstname": this.RegisterForm.value.username,
        "lastname": this.RegisterForm.value.lastname,
        "club": ["/api/clubs/" + this.RegisterForm.value.club],
        "tel_number": this.RegisterForm.value.tel_number,
        "seanceLeft": 0
      }

      this.httpClient.post('http://localhost:8000/api/register', formData).subscribe(
        response => {
          this.router.navigate(['/login']);
        },
        error => console.error(error)
      );
    }


  }
}
