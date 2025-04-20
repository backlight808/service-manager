import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3001/program'; // Your backend API endpoint
    private isLoggedIn = false; // Simple in-memory authentication state

    constructor(private http: HttpClient, private router: Router) {}

    // Method to send login request to your backend API
    login(credentials: { username: string; password: string }) : Observable<{ token: string }>  {
       return this.http.post<{ success: boolean; token: string }>(`${this.apiUrl}/login`, credentials).pipe(
            tap((response) => {
                if (response.success) {
                    // Store the token in localStorage
                    localStorage.setItem('authToken', response.token);
                    this.isLoggedIn = true;

                //     const payload = JSON.parse(atob(response.token.split('.')[1])); // Decode the JWT payload
                //     const userRole = payload.role; // Extract the role from the payload

                //     // Redirect based on user role
                //     if (userRole === 'admin') {
                //         this.router.navigate(['/dashboard']); // Redirect admin to dashboard
                //     } else if (userRole === 'user') {
                //         this.router.navigate(['/user']); // Redirect user to user component
                //     } else {
                //         alert('Unknown role'); // Handle unknown roles
                //     }
                //    // this.router.navigate(['/dashboard']); // Redirect to dashboard
                }
            }),
            catchError((error) => {
                console.error('Login error:', error);
                alert('Invalid username or password');
                throw error;
            })
        );
    }
     // Method to check if the user is authenticated
     isAuthenticated(): boolean {
        //return this.isLoggedIn;
        return !!localStorage.getItem('authToken'); // Check if token exists
        
    }
    getUserDetails(){
        const token = localStorage.getItem('authToken');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
          return payload;
        }
        return null;
    }

    // Method to log out the user
    logout() {
        localStorage.removeItem('authToken'); // Remove the token
        this.isLoggedIn = false; // Reset authentication state
        this.router.navigate(['/login']); // Redirect to the login page
    }
}
