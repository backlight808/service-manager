import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./components/login-component/login.component";
import { AuthService } from './services/auth.service';
import { DashboardComponent } from "./components/dashboard/dashboard.component";




interface ProgramData {
  id: number;
  city: string;
  temperature: string;
  conditions: string;
  humidity: string;
  latitude: string;
  longitude: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],// Ensure HttpClientModule is here
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  ProgramData: ProgramData[] = [];
  loading = true;
 
  userDetails: any = null;
  userRole: string | null = null; 
  error: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void { 
   this.userDetails = this.authService.getUserDetails(); 
   if (!this.userDetails) {
     // Handle the case where user details are not available (e.g., token expired)
     // Redirect to login or show an error message
     console.error('User details not found, redirecting to login');
     this.authService.logout(); // Clear token and redirect 
   }
   else{
    console.log('User details found:', this.userDetails);
   }
  }
  logout() {
    this.userDetails = null;
    this.authService.logout(); 
  }
}