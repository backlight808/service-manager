import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect the root path to 'login'
  { path: 'login', component: LoginComponent } // Route for the login page
];