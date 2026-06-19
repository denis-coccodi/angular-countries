import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FullCountry } from '@country-explorer/types/backend';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

@Injectable({ providedIn: 'root' })
export class AlphaService {
  private http = inject(HttpClient);
  private baseUrl = inject(REST_COUNTRIES_API_BASE_URL);

  getByCode(code: string): Observable<FullCountry[]> {
    return this.http.get<FullCountry[]>(
      `${this.baseUrl}/codes.alpha_3/${code}`,
    );
  }

  // v5 has no multi-code endpoint, so fan out to one request per code and
  // flatten. Callers pass small code sets (e.g. the countries being compared).
  getByCodes(codes: string[]): Observable<FullCountry[]> {
    if (!codes.length) {
      return of([]);
    }

    return forkJoin(codes.map((code) => this.getByCode(code))).pipe(
      map((results) => results.flat()),
    );
  }
}
