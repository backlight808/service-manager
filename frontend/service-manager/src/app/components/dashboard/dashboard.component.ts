import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent  implements OnInit {
  userDetails: any;
  private router = inject(Router);
  constructor(private authService: AuthService) {}

  ngOnInit() {
   // this.userDetails = this.authService.getUserDetails();
    // if (!this.userDetails) {
    //   // Handle the case where user details are not available (e.g., token expired)
    //   // Redirect to login or show an error message
    //   console.error('User details not found, redirecting to login');
    //   this.authService.logout(); // Clear token and redirect
    // }
  }

  logout() {
    this.authService.logout();
  }
}
