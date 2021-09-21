import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ValidatorService {
  // static emailExist: any;
  constructor(private http: HttpClient) { }

  emailExist(email: string) {

    let formData = new FormData();
    formData.append('email', email);

    return this.http.post(
      environment.restApi.uri + '/validator/email', formData,
    )
  }
}





