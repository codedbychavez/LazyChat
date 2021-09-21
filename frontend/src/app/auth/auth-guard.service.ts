import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router'
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router) { }

  canActivate() {
    const _isAuthenticated = this.authService.isAuthenticated();

    if (_isAuthenticated) {
        return true;
    } else {
    this.router.navigate(['auth']);
    return false;
    }
}

}
