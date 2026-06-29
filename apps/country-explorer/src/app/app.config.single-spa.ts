import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  CountriesV5MapperInterceptor,
  REST_COUNTRIES_API_BASE_URL,
} from '@country-explorer/rest-countries-api';
import { provideSingleSpa } from 'single-spa-angular';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

/**
 * Application config used when Country Explorer is mounted inside the single-spa
 * hub. Unlike the standalone {@link appConfig} (which uses hash routing), this
 * uses path-based routing under the `/country-explorer` base href so the hub can
 * mount it on a clean URL prefix and single-spa `activeWhen` can match by path.
 */
export const singleSpaAppConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    { provide: APP_BASE_HREF, useValue: '/country-explorer' },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: CountriesV5MapperInterceptor, multi: true },
    // Relative path → resolves to the hub origin, which proxies to the v5 API.
    { provide: REST_COUNTRIES_API_BASE_URL, useValue: environment.restCountriesApiBaseUrl },
    // Zone-aware Location so router updates are picked up correctly when mounted.
    provideSingleSpa(),
  ],
};
