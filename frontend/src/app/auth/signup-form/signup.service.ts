import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient) { 
    this.baseUrl = environment.restApi.uri;
  }

  signupUser(data: any) {
    return this.httpClient.post<any>(
      this.baseUrl + '/user/create', data
    );
  }
}
