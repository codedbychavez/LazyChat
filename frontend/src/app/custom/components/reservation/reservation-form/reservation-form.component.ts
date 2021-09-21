import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reservation } from '../models/reservation.model';

// Custom validator imports
import { pastDateValidator } from '../validators/date.validator';
import { pastTimeValidator } from '../validators/time.validator';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})


export class ReservationFormComponent implements OnInit {

  @ViewChild("personInput", { static: true })

  personInput: any;

  filteredItems: any;

  items = [
    {
    "id": 1,
    "name": "chavez harris",
    "email": "xelo@example.com"
    }, 
    {
      "id": 2,
      "name": "chavez harris",
      "email": "rajin@example.com"
    },
    {
      "id": 3,
      "name": "chavez harris",
      "email": "chavez@example.com"
    },
    {
      "id": 4,
      "name": "cheveland harrison",
      "email": "che@example.com"
    },
    {
      "id": 5,
      "name": "chendra harrish",
      "email": "chend@example.com"
    },
    {
      "id": 6,
      "name": "chavez harris",
      "email": "chavez@example.com"
    },
    {
      "id": 7,
      "name": "cheveland harrison",
      "email": "che@example.com"
    },
    {
      "id": 8,
      "name": "chendra harrish",
      "email": "chend@example.com"
    },
    {
      "id": 9,
      "name": "chendra harrish",
      "email": "chend@example.com"
    },
    {
      "id": 10,
      "name": "chavez harris",
      "email": "chavez@example.com"
    }

  ]

  reservationForm!: FormGroup;
  reservationModel = new Reservation();
  

  constructor(public form_builder: FormBuilder) {
    this.personInput = ElementRef;
    this.reservationModel = new Reservation();
   }

  ngOnInit(): void {
    this.initializeReservationform();
  }

  assignCopy(){
    this.filteredItems = Object.assign([], this.items);
 }

 filterItem(value: any){
  if(!value){
      this.assignCopy();
      this.reservationForm.controls['person'].setErrors({'required': true});
  } // when nothing has typed
  this.filteredItems = Object.assign([], this.items).filter(
    (item: { name: string; }) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
  )

  if(value.length <= 1) {
    this.filteredItems = [];
  }
}

selectPerson(id: number) {
  console.log(id)
  this.filteredItems = [];
  // Populate the input field when user clicks on person's name
  const selectedPersonName = this.items.find(x => x.id === id)?.name;
  const selectedPersonId = this.items.find(x => x.id === id)?.id;

  this.personInput.nativeElement.value = selectedPersonName;
  this.reservationForm.patchValue({
    person: selectedPersonId,
  });

}

initializeReservationform(): void {
  this.reservationForm = this.form_builder.group({
    id: this.reservationModel.id,
    person: [this.reservationModel.person, Validators.required],
    reservationType: [this.reservationModel.reservationType, Validators.required],
    date: [this.reservationModel.date, Validators.required, pastDateValidator()],
    time: [this.reservationModel.time, Validators.required],
    notify: this.reservationModel.notify
  }, {
    validator: pastTimeValidator('date', 'time'),
  });
}

reservationFormSubmit() {

    const data = this.reservationForm.getRawValue();
    // fix notify
    if(data.notify == null) {
      data.notify = false;
    }
    console.log(data);
}


}



