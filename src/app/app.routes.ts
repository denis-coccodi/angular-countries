import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'countries',
    loadComponent: () =>
      import('./countries/country-list/country-list.component').then(
        (m) => m.CountryListComponent,
      ),
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('./compare-countries/compare-countries.component').then(
        (m) => m.CompareCountriesComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'countries',
    pathMatch: 'full',
  },
];
