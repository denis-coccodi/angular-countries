import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { REST_COUNTRIES_API_BASE_URL } from '@country-explorer/rest-countries-api';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { AfghanistanFlagInterceptor } from './shared/afghanistan-flag-interceptor/afghanistan-flag.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({ anchorScrolling: 'enabled' }),
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AfghanistanFlagInterceptor, multi: true },
    { provide: REST_COUNTRIES_API_BASE_URL, useValue: environment.restCountriesApiBaseUrl },
  ],
};
