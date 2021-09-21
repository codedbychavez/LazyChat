import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';

import * as moment from "moment";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string;
  private userLoggedIn!: boolean;
  private check: any;

  constructor(private httpClient: HttpClient, private router: Router) { 
    this.baseUrl = environment.restApi.uri;
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
  }

  setSession(authResponse:any) {
    if(authResponse.refresh) {
      const refreshToken = authResponse.refresh;
      localStorage.setItem('refresh_token', JSON.stringify(refreshToken));
      // const decodedRefreshToken = this.decodeToken(authResponse.refresh);
      // const refreshTokenWillExpAt = new Date(decodedRefreshToken.exp * 1000);
      // console.log('Refresh token will expire at: ', refreshTokenWillExpAt);


    }
    const decodedToken = this.decodeToken(authResponse.access);
    const token = authResponse.access;
    const expiresAt = moment().add(decodedToken.exp,'second');
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));

    // const tokenWillExpAt = new Date(decodedToken.exp * 1000);
    // console.log('Token will expire at: ', tokenWillExpAt);
    localStorage.setItem("token", JSON.stringify(token));
    this.router.navigate(['home']);
    this.userLoggedIn = true;
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
    const token = localStorage.getItem('token');
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
      token = this.getToken();
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
