import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { REST_COUNTRIES_API_BASE_URL } from '@country-explorer/rest-countries-api';
import { routes } from './app.routes';
import { AfghanistanFlagInterceptor } from './shared/afghanistan-flag-interceptor/afghanistan-flag.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AfghanistanFlagInterceptor, multi: true },
    { provide: REST_COUNTRIES_API_BASE_URL, useValue: environment.restCountriesApiBaseUrl },
  ],
};
