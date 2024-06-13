import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  mail_valid: boolean = true;
  password_valid: boolean = true;
  connect_valid: boolean = true;


  constructor (
    private httpClient: HttpClient,
    private router: Router
  ) {
  }



  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  connect() {

    if(this.loginForm.controls.email.errors) {
      this.mail_valid = false;
    } else {
      this.mail_valid = true;
    }
    if(this.loginForm.controls.password.errors) {
      this.password_valid = false;
    } else {
      this.password_valid = true;
    }

    if(this.mail_valid && this.password_valid) {
      const formData = {
        "mail": this.loginForm.value.email,
        "password": this.loginForm.value.password
      }

      this.httpClient.post('http://localhost:8000/api/login', formData).subscribe(
        response => {
          this.connect_valid = true;
          this.router.navigate(['/home'], { queryParams: { user: response } });
        },
        error => {
          this.connect_valid = false;
        }
      );
    }

  }

}
