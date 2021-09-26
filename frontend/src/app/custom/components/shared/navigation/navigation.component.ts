import { Component, OnInit, DoCheck } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, DoCheck {

  showNavBar!: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.showNavBar = this.authService.checkIfUserLoggedIn();
  }

  logOut() {
    this.authService.logoutUser();
  }
  
  ngDoCheck() {
    this.showNavBar = this.authService.checkIfUserLoggedIn();

  }

}
