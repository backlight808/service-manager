import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf and ngFor directives
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel directive

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule to imports
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = { username: '', password: '' }; // Object to store username and password
  error: string | null = null;
  isLoggedIn = false; // Flag to track login status
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
      this.authService.login(this.credentials).subscribe(
          (response: any) => {
            // console.log('Login successful:', response);
            //  // this.authService.setToken(response.token);
            //   this.router.navigate(['/dashboard']); // Redirect to the dashboard on successful login
            //   this.error = null;
            if (response.success) {
              // Store the token in localStorage
              localStorage.setItem('authToken', response.token);
              this.isLoggedIn = true;

              // Decode the token to get user details
              const payload = JSON.parse(atob(response.token.split('.')[1])); // Decode the JWT payload
              const userRole = payload.role; // Extract the role from the payload

              // Redirect based on user role
              if (userRole === 'admin') {
                  this.router.navigate(['/dashboard']); // Redirect admin to dashboard
              } else if (userRole === 'user') {
                  this.router.navigate(['/user']); // Redirect user to user component
              } else {
                this.router.navigate(['/unautherised']); // Redirect user to user component
              }
          }
          },
          (error: any) => {
              console.error('Login error:', error);
              this.error = 'Invalid username or password'; // Set error message
          }
      );
  }
}
