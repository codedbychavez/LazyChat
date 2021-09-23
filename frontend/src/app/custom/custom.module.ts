import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservationFormComponent } from './components/reservation/reservation-form/reservation-form.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../auth/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'home',
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  declarations: [
    DashboardComponent, 
    ReservationFormComponent, 
    ReservationComponent, 
    ProfileComponent, 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,
  ]
})
export class CustomModule { }
