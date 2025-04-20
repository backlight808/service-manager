import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProgramService } from '../../programs.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DatePipe] // Provide DatePipe here
})
export class DashboardComponent implements OnInit {
  userDetails: any;
  private router = inject(Router);
  editingProgram: boolean = false;
  selectedProgramName: string = '';
  participantsLoading: boolean = false;
  participantsError: string | null = null;
  participants: any[] = [];
  programs: any[] = [];
  programForm: any = {
    program_name: '',
    start_date: '',
    end_date: '',
    principal_investigator: '',
    funding_amount: null,
    program_description: ''
  };
  loading: boolean = false;
  userRole: string | null = null;
  error: string | null = null;
  success: string | null = null;
  ProgramData: any[] = [];


  showModal: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';



  constructor(private authService: AuthService, private programService: ProgramService, private datePipe: DatePipe ) { }

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
  // openModal(title: string, content: string): void {
  //   this.modalTitle = title;
  //   this.modalContent = content;
  //   this.showModal = true;
  // }
  closeModal(): void {
    this.showModal = false;
  }

  confirmAction(): void {
    console.log('Action confirmed!');
    this.closeModal();
  }
  viewParticipants(a: any) {


  }
  applyProgram(inte: number) {


  }
  addProgram(title: string, content: string | null): void {
    this.modalTitle = title;
    this.editingProgram = true;
    this.showModal = true;
    this.programForm={};// Reset the form data
  }
  saveProgram() { 
    console.log(this.programForm);
    this.loading = true; // Show loading state during deletion
    this.programService.createProgramData(this.programForm).subscribe(
      (response) => {
        // Remove the deleted program from the ProgramData array
        // this.ProgramData = this.ProgramData.filter((program) => program.program_id !== delId);
        this.loading = false;
        this.error = null; // Clear any previous errors
        this.success = 'Program added successfully!';
        this.showModal = false;
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
      },
      (err) => {
        // Handle the error gracefully
        console.error('Error adding program:', err); // Log the error for debugging
        this.error = err.error?.error || 'Failed to add Program data'; // Display a user-friendly error message
        this.loading = false; // Reset the loading state
      }
    );
  }
  editSaveProgram(){
    let editId = this.programForm.program_id  
    this.loading = true; // Show loading state during deletion
    this.programService.editProgramData(this.programForm).subscribe(
      (response) => {
        //  
        const index = this.ProgramData.findIndex((program) => program.program_id === editId);
        if (index !== -1) {
          this.ProgramData[index] = { ...this.ProgramData[index], ...this.programForm };
        }
        this.loading = false;
        this.error = null; // Clear any previous errors
        this.showModal = false;
        this.success = 'Program updated successfully!'; // Display success message
      },
      (err) => {
        // Handle the error gracefully
        console.error('Error deleting program:', err); // Log the error for debugging
        this.error = err.error?.error || 'Failed to delete Program data'; // Display a user-friendly error message
        this.loading = false; // Reset the loading state
      }
    );

  }
  editProgram(title:string, editData: any) { 
      this.programForm.program_id = editData.program_id,
      this.programForm.program_name = editData.program_name,
      this.programForm.start_date = this.datePipe.transform(editData.start_date, 'yyyy-MM-dd');
      this.programForm.end_date = this.datePipe.transform(editData.end_date, 'yyyy-MM-dd');
      this.programForm.principal_investigator = editData.principal_investigator,
      this.programForm.funding_amount = editData.funding_amount,
      this.programForm.program_description = editData.program_description

    this.editingProgram = true;
    this.showModal = true;
    this.modalTitle = title;

  }
  deleteProgram(delId: number) {
    this.loading = true; // Show loading state during deletion
    this.programService.deleteProgramData(delId).subscribe(
      (response) => {
        // Remove the deleted program from the ProgramData array
        this.ProgramData = this.ProgramData.filter((program) => program.program_id !== delId);
        this.loading = false;
        this.error = null; // Clear any previous errors
        this.success = 'Program deleted successfully!';
      },
      (err) => {
        // Handle the error gracefully
        console.error('Error deleting program:', err); // Log the error for debugging
        this.error = err.error?.error || 'Failed to delete Program data'; // Display a user-friendly error message
        this.loading = false; // Reset the loading state
      }
    );
  }
}


