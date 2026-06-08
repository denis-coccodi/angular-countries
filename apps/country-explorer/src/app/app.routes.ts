import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'countries',
    loadComponent: () =>
      import('@country-explorer/countries').then((m) => m.CountryListComponent),
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('@country-explorer/compare-countries').then((m) => m.CompareCountriesComponent),
  },
  {
    path: '',
    redirectTo: 'countries',
    pathMatch: 'full',
  },
];
