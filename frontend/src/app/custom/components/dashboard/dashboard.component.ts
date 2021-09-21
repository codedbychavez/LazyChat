import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { 

  }

  ngOnInit(): void {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
  }
  }

}
