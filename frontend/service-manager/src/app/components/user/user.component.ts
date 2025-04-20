import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  userDetails: any;
  loading = false;
  error: string | null = null;
  programs: any[] = [];
  selectedProgramName = '';

  
  private router = inject(Router);
  constructor(private authService: AuthService) {}

  ngOnInit() {
   this.userDetails = this.authService.getUserDetails();
    if (!this.userDetails) {
      // Handle the case where user details are not available (e.g., token expired)
      // Redirect to login or show an error message
      console.error('User details not found, redirecting to login');
      this.authService.logout(); // Clear token and redirect
    }
  }
  applyProgram(inte:number){
    // Implement the logic to apply for a program
    }
    handleFileChange(event: any) {

    }
    submitApplication() {
      
    }
  logout() {
    this.authService.logout();
  }
}
