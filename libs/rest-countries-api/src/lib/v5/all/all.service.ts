import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, concat, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Country } from '@country-explorer/types/backend';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

// REST Countries v5 free plan caps each request at 100 objects, so the full
// country list (~250) must be fetched page by page.
const PAGE_LIMIT = 100;

@Injectable({ providedIn: 'root' })
export class AllService {
  private http = inject(HttpClient);
  private baseUrl = inject(REST_COUNTRIES_API_BASE_URL);

  // Streams the country list progressively: each completed page produces an
  // emission carrying the running accumulated array. Consumers backed by
  // `rxResource` re-render on every emission, so the UI can show the first 100
  // countries as soon as page 0 arrives and grows as later pages stream in,
  // rather than blocking on the full ~250-entry payload.
  get(): Observable<Country[]> {
    return this.fetchFrom(0, []).pipe(
      // Drop codeless entries (e.g. disputed territories the legacy API
      // omitted), since the app keys countries by `cca3`.
      map((countries) => countries.filter((country) => !!country.cca3)),
    );
  }

  private fetchFrom(offset: number, acc: Country[]): Observable<Country[]> {
    return this.fetchPage(offset).pipe(
      concatMap((page) => {
        const combined = acc.concat(page);
        // Always emit what we have so far. If the page was full, keep paging
        // in the background while subscribers already see the partial result.
        // (Page length is measured pre-filtering by the mapper interceptor, so
        // it still reflects the API's pagination accurately.)
        return page.length < PAGE_LIMIT
          ? of(combined)
          : concat(of(combined), this.fetchFrom(offset + PAGE_LIMIT, combined));
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
