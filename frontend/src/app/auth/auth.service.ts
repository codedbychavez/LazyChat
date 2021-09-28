import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';

import * as moment from "moment";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string;
  private userLoggedIn!: boolean;
  private check: any;
  userIdFromJwt = new Observable<any>();
  private user: any;

  private userSubject!: Subject<any>;

  constructor(private httpClient: HttpClient, private router: Router) { 
    this.baseUrl = environment.restApi.uri;

    this.userSubject = new Subject<any>();
    this.userIdFromJwt = this.userSubject.asObservable();
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  checkIfUserLoggedIn(): boolean {
    return this.userLoggedIn;
  }

  // login
  loginUser(authResponse: any) {
      this.setSession(authResponse)
    }
   

  logoutUser() {
    
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");

    localStorage.removeItem("expires_at");
    this.router.navigate(['auth']);
    this.userLoggedIn = false;
    this.userSubject.next(0);
  }

  setSession(authResponse:any) {
    if(authResponse.refresh) {
      const refreshToken = authResponse.refresh;
      localStorage.setItem('refresh_token', JSON.stringify(refreshToken));
    }
    const decodedToken = this.decodeToken(authResponse.access);
    // Set userId
    this.getUser(decodedToken.user_id).subscribe(
      (user) => {
        this.setUser(user);
      }, (err: HttpErrorResponse) => {
        console.log(err)
      }
    )
    
    // this.setUser(decodedToken.user_id);
    const token = authResponse.access;
    const expiresAt = moment().add(decodedToken.exp,'second');
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("token", JSON.stringify(token));
    this.router.navigate(['home']);
    this.userLoggedIn = true;
  }

  getUser(userId: number) {
    return this.httpClient.post<any>(
      this.baseUrl + '/user/get_user', {userId}
    )
  }

  getAccessTokenWithRefreshToken() {
    const refreshToken = this.getrefreshToken();

    this.askForNewAccessTokenUsingRefeshToken(refreshToken).subscribe(
      (authResponse) => {
        
        this.setSession(authResponse);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    )
  }


  public getToken(): any {
    const token = localStorage.getItem("token");
    return JSON.parse(token!);
  }

  public decodeToken(token: any): any {
    let decodedToken = {};

    if(token) {
      const jwtHelper: JwtHelperService = new JwtHelperService();
      decodedToken = jwtHelper.decodeToken(token);
    }

    return decodedToken;
  }

// get refresh token
  public getrefreshToken(): string {
    const refresh_token = localStorage.getItem('refresh_token');
    return JSON.parse(refresh_token!);
  }

  public isAuthenticated(): boolean {
    // Check if token is expired
    return this.checkTokenExpiration();

    }


  checkTokenExpiration() {
    
    const jwtHelper: JwtHelperService = new JwtHelperService();
    let token = this.getToken();
    // jwtHelper.isTokenExpired returns false when token is not expired but true if it is
    // Hence we flip the below and return thw opposite of the result
    if(!jwtHelper.isTokenExpired(token)) {
      this.getAccessTokenWithRefreshToken();
    }

    return !jwtHelper.isTokenExpired(token);

  }


  // Login user in
  checkAuthCredsAgainstApi(data: any) {
    return this.httpClient.post<any>(
      this.baseUrl + '/api/token/', data
    );
  }

  askForNewAccessTokenUsingRefeshToken(refresh_token: any) {
    let formData = new FormData();
    formData.append('refresh', refresh_token);
  
    return this.httpClient.post<any>(
      this.baseUrl + '/api/token/refresh/', formData
    );
  }


}
