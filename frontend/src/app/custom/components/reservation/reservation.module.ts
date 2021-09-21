import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from './reservation.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';



@NgModule({
  declarations: [
    ReservationComponent,
    ReservationFormComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ReservationFormComponent
  ]
})

export class ReservationModule { }
