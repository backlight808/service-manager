import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface ProgramData {
  id: number;
  city: string;
  temperature: string;
  conditions: string;
  humidity: string;
  latitude: string;
  longitude: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
 
  private apiUrl = 'http://localhost:3001/program'; // API endpoint

  constructor(private http: HttpClient) { }

  // Method to fetch Program data
  getProgramData(): Observable<ProgramData[]> {
    return this.http.get<ProgramData[]>(this.apiUrl+'/all');
  }
  
  // Method to delete Program data
  deleteProgramData(id:number): Observable<ProgramData[]> {
    return this.http.delete<ProgramData[]>(this.apiUrl+'/remove/'+id);
  }
  // Method to create Program data
  createProgramData(body:any): Observable<ProgramData[]> {
    return this.http.post<ProgramData[]>(this.apiUrl+'/store', body);
  }
  // Method to update Program data
  editProgramData(body:any): Observable<ProgramData[]> {
    return this.http.put<ProgramData[]>(this.apiUrl+'/update/'+body.program_id, body);
  }

  applyForProgram(body:any): Observable<ProgramData[]> {
    debugger;
    return this.http.post<ProgramData[]>(this.apiUrl+'/apply', body);
  }
}

