import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from './weather-service.service';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./components/login-component/login.component";


interface WeatherData {
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
  imports: [CommonModule,RouterOutlet],// Ensure HttpClientModule is here
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  weatherData: WeatherData[] = [];
  loading = true;
  error: string | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.getWeatherData().subscribe(
      (data) => {
        this.weatherData = data;
        this.loading = false;
        this.error = null;
      },
      (error) => {
        this.error = error.message || 'Failed to fetch weather data';
        this.loading = false;
        this.weatherData = [];
      }
    );
  }
}