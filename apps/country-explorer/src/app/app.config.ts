import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import {
  CountriesV5MapperInterceptor,
  REST_COUNTRIES_API_BASE_URL,
} from '@country-explorer/rest-countries-api';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

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
    // Registered after the Afghanistan interceptor on purpose: HTTP responses
    // run interceptors in reverse, so this maps the v5 envelope to the internal
    // array first, and the Afghanistan override then operates on mapped data.
    { provide: HTTP_INTERCEPTORS, useClass: CountriesV5MapperInterceptor, multi: true },
    { provide: REST_COUNTRIES_API_BASE_URL, useValue: environment.restCountriesApiBaseUrl },
  ],
};
