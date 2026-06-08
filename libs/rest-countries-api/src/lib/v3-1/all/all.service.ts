import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '@country-explorer/types/backend';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

const COUNTRY_FIELDS = [
  'name',
  'capital',
  'region',
  'population',
  'area',
  'currencies',
  'languages',
  'borders',
  'flags',
  'cca3',
];

@Injectable({ providedIn: 'root' })
export class AllService {
  private http = inject(HttpClient);
  private baseUrl = inject(REST_COUNTRIES_API_BASE_URL);

  get(): Observable<Country[]> {
    return this.http.get<Country[]>(
      `${this.baseUrl}/all?fields=${COUNTRY_FIELDS.join(',')}`,
    );
  }
}
