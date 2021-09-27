import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserAccount } from './models/user-account.model';
import { SignupService } from './signup.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var UIkit: any;

import { AbstractControl, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";

// Validation service imports
import { ValidatorService } from '../validators/validator.service';

// Custom validators
import { mustMatch, passwordStrengthValidator } from '../validators/password.validator';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  signupForm!: FormGroup;
  userAccountModel = new UserAccount();
  public baseUrl = environment.restApi.uri;
  public emailExistResult!: boolean;

  constructor(public formBuilder: FormBuilder, 
    private signupService: SignupService, 
    public router: Router,
    public httpClient: HttpClient,
    private validationSevice: ValidatorService,
    ) { 
    this.userAccountModel = new UserAccount();
   }

  ngOnInit(): void {
    this.initializeSignupForm();
  }

  initializeSignupForm(): void {
    this.signupForm = this.formBuilder.group({
    firstName: [this.userAccountModel.firstName, Validators.required],
    lastName: [this.userAccountModel.lastName, Validators.required],
    email: [this.userAccountModel.email, [Validators.required, Validators.email]],
    accountType: [this.userAccountModel.accountType, Validators.required],
    password: [this.userAccountModel.password, [Validators.required, Validators.minLength(6), Validators.maxLength(16), passwordStrengthValidator()]],
    confirmPassword: [this.userAccountModel.confirmPassword, [Validators.required]],

    }, {
      validator: mustMatch('password', 'confirmPassword'),
    })
  }

  signupFormSubmit() {
    const data = this.signupForm.getRawValue();
    this.signupService.signupUser(data).subscribe(
      (signupUserResponse) => {
        this.showLoginTab();
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    )
  }


  showLoginTab() {
    // Using the id of <ul with uk-tab attribute from auth.component.html
    UIkit.tab('#uk-tab').show(0);

  }


  // Email validation functions

  emailExistValidator(event: any){
    const email = event.target.value;
        // Validate validate at endpoint
        this.validationSevice.emailExist(email).subscribe(
            (result: any) => {
                this.emailExistResult = result;
                if(this.emailExistResult) {
                  this.signupForm.controls['email'].setErrors({'emailTaken': true});
                } else {
                  // do nothing
                 
                }
            }
        )
    }
  }




