import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Country } from '../../shared/types/countries.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  countries = signal<Country[]>([]);

  constructor(private http: HttpClient) {}

  getAll(): Observable<Country[]> {
    return this.http
      .get<Country[]>(
        'https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,currencies,languages,borders,flags,cca3',
      )
      .pipe(
        tap((data: Country[]) => {
          this.countries.set(data);
        }),
      );
  }

  getByCode(code: string): Observable<any> {
    return this.http.get('https://restcountries.com/v3.1/alpha/' + code);
  }

  searchByName(name: string): Observable<any> {
    return this.http.get('https://restcountries.com/v3.1/name/' + name);
  }

  getByRegion(region: string): Observable<any> {
    return this.http.get('https://restcountries.com/v3.1/region/' + region);
  }

  getByCodes(codes: string[]): Observable<any> {
    return this.http.get(
      'https://restcountries.com/v3.1/alpha?codes=' + codes.join(','),
    );
  }
}

