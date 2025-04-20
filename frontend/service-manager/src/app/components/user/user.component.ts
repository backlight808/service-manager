import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProgramService } from '../../programs.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  userDetails: any;
  loading = false;
  error: string | null = null;
  programs: any[] = [];
  selectedProgramName = '';
  showModal = false;
  success: string | null = null;
  modalTitle = '';
  modalContent = '';
  ProgramData: any[] = [];
  applicationForm: any = {
    program_id:'',
    participant_name:'',
    date_of_birth:'',
    gender:'',
    medical_history:'',
    consent_form:'',
  };
   
  private router = inject(Router);
  constructor(private authService: AuthService, private programService: ProgramService,) { }

  ngOnInit() {
    this.programService.getProgramData().subscribe(
      (data) => {
        this.ProgramData = data;
        this.loading = false;
        this.error = null; 
      },
      (error) => {
        this.error = error.message || 'Failed to fetch Program data';
        this.loading = false;
        this.ProgramData = [];
      }
    );
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      this.userDetails = payload; // Store user details in a class property 
    }
  }
  applyProgram(inte: number) {
    debugger;
    this.showModal = true;
    this.modalTitle = 'Apply for Program';
    this.applicationForm.program_id = inte; // Set the program ID in the application form
    this.loading = true; // Show loading state during deletion
    

    // Implement the logic to apply for a program
  }
  handleFileChange(event: any) {

  }
  submitApplication() {
    debugger
    this.programService.applyForProgram(this.applicationForm).subscribe(
      (response) => {
        // Remove the deleted program from the ProgramData array
        // this.ProgramData = this.ProgramData.filter((program) => program.program_id !== delId);
        this.loading = false;
        this.error = null; // Clear any previous errors
        this.success = 'Program added successfully!';
        this.showModal = false;
        
      },
      (err) => {
        // Handle the error gracefully
        console.error('Error adding program:', err); // Log the error for debugging
        this.error = err.error?.error || 'Failed to add Program data'; // Display a user-friendly error message
        this.loading = false; // Reset the loading state
      }
    );
  }
  closeModal(): void {
    this.showModal = false;
  }

  logout() {
    this.authService.logout();
  }
}
