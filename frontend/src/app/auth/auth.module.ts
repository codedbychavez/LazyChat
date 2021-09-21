import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from './auth/auth.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { AuthService } from './auth.service';

import { Injector } from '@angular/core';

export let InjectorInstance: Injector;

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
  }
];

@NgModule({
  declarations: [
    AuthComponent,
    LoginFormComponent,
    SignupFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [],
  providers: [AuthService]
})
export class AuthModule { 

  constructor(private injector: Injector) {
    InjectorInstance = this.injector;
  }
}
