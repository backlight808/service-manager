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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
      this.authService.login(this.credentials).subscribe(
          (response: any) => {
            console.log('Login successful:', response);
             // this.authService.setToken(response.token);
              this.router.navigate(['/dashboard']); // Redirect to the dashboard on successful login
              this.error = null;
          },
          (error: any) => {
              console.error('Login error:', error);
              this.error = 'Invalid username or password'; // Set error message
          }
      );
  }
}
