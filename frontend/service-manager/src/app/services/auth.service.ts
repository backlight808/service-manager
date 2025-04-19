import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3001/weather'; // Your backend API endpoint
    private isLoggedIn = false; // Simple in-memory authentication state

    constructor(private http: HttpClient, private router: Router) {}

    // Method to send login request to your backend API
    login(credentials: { username: string; password: string }) {
        return this.http.post<{ success: boolean }>(`${this.apiUrl}/login`, credentials);
    }
     // Method to check if the user is authenticated
     isAuthenticated(): boolean {
        return this.isLoggedIn;
    }


    // Method to log out the user
    logout() {
        this.isLoggedIn = false; // Reset authentication state
        this.router.navigate(['/login']); // Redirect to the login page
    }
}
