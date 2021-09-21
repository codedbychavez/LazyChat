import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Login } from './models/login.model';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm!: FormGroup;
  loginModel = new Login();

  constructor(public formBuilder: FormBuilder, private authService: AuthService, public router: Router) {
    this.loginModel = new Login();
   }

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  initializeLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      username: [this.loginModel.username, [Validators.required, Validators.email]],
      password: [this.loginModel.password, [Validators.required]]
    })
  }

  loginFormSubmit() {
    // Check if user is already authenticated
    const _isAuthenticated = this.authService.isAuthenticated();

    if(_isAuthenticated) {
      this.router.navigate(['home']);
    } else {
      const data = this.loginForm.getRawValue();
      this.authService.checkAuthCredsAgainstApi(data).subscribe(
        (authResponse) => {
          // console.log(authResponse);
          this.authService.loginUser(authResponse);
        }, 
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      )
    }
  }

}
