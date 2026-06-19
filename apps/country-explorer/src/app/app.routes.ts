import { Routes } from '@angular/router';
import { CompareCountriesStore } from '@country-explorer/compare-countries';

export const routes: Routes = [
  {
    path: 'countries',
    loadComponent: () =>
      import('@country-explorer/countries').then((m) => m.CountryListComponent),
  },
  {
    path: 'compare',
    providers: [CompareCountriesStore],
    loadComponent: () =>
      import('@country-explorer/compare-countries').then((m) => m.CompareCountriesComponent),
  },
  {
    path: '',
    redirectTo: 'countries',
    pathMatch: 'full',
  },
];
