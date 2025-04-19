import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface WeatherData {
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
export class WeatherService {
 
  private apiUrl = 'http://localhost:3001/weather/all'; // API endpoint

  constructor(private http: HttpClient) { }

  // Method to fetch weather data
  getWeatherData(): Observable<WeatherData[]> {
    return this.http.get<WeatherData[]>(this.apiUrl);
  }
}

