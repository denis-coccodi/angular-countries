import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FullCountry } from '@country-explorer/types/backend';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

@Injectable({ providedIn: 'root' })
export class NameService {
  private http = inject(HttpClient);
  private baseUrl = inject(REST_COUNTRIES_API_BASE_URL);

  search(name: string): Observable<FullCountry[]> {
    return this.http.get<FullCountry[]>(`${this.baseUrl}/name/${name}`);
  }
}
