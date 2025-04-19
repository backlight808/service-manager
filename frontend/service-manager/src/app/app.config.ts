// filepath: c:\Users\radha\Desktop\Ani\a HCL Docs\HCL-project\Repo\frontend\service-manager\src\app\app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // Provide HttpClient here
  ]
};