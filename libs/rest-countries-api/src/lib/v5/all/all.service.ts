import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Country } from '@country-explorer/types/backend';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

// REST Countries v5 free plan caps each request at 100 objects, so the full
// country list (~250) must be fetched page by page.
const PAGE_LIMIT = 100;

@Injectable({ providedIn: 'root' })
export class AllService {
  private http = inject(HttpClient);
  private baseUrl = inject(REST_COUNTRIES_API_BASE_URL);

  get(): Observable<Country[]> {
    // Drop codeless entries (e.g. disputed territories) the legacy API omitted,
    // since the app keys countries by `cca3`.
    return this.fetchFrom(0, []).pipe(
      map((countries) => countries.filter((country) => !!country.cca3)),
    );
  }

  private fetchFrom(offset: number, acc: Country[]): Observable<Country[]> {
    return this.fetchPage(offset).pipe(
      switchMap((page) => {
        const combined = acc.concat(page);
        // A full page means there may be more; a short page is the last one.
        // (Page length is measured pre-filtering by the mapper interceptor, so
        // it still reflects the API's pagination accurately.)
        return page.length < PAGE_LIMIT
          ? of(combined)
          : this.fetchFrom(offset + PAGE_LIMIT, combined);
      }),
    );
  }

  private fetchPage(offset: number): Observable<Country[]> {
    const params = new HttpParams()
      .set('limit', PAGE_LIMIT)
      .set('offset', offset);

    return this.http.get<Country[]>(this.baseUrl, { params });
  }
}
