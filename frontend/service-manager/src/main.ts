import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {HttpClientModule} from '@angular/common/http';
 

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './app/components/login-component/login.component';
import { AuthInterceptor } from './app/intercepters/auth.interceptor';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { UnauthorizedComponent } from './app/components/unauthorized/unauthorized.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

bootstrapApplication(AppComponent, {
  providers: [
      provideHttpClient(withInterceptors([AuthInterceptor])),
      { provide: JWT_OPTIONS, useValue: {
          tokenGetter: () => localStorage.getItem('authToken'),
      }},
      JwtHelperService,
      provideRouter(routes), // Use provideRouter instead of RouterModule.forRoot
  ],
}).catch(err => console.error(err));
