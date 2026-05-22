import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Country, FullCountry } from '../../shared/types/countries.model';

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
          this.countries.set(
            data.sort((a, b) => a.name.common.localeCompare(b.name.common)),
          );
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

  getByCodes(codes: string[]): Observable<FullCountry[]> {
    return this.http
      .get<FullCountry[]>(
        'https://restcountries.com/v3.1/alpha?codes=' + codes.join(','),
      )
      .pipe(
        map((countries: FullCountry[]) =>
          countries.map((country: FullCountry) => ({
            ...country,
            borders: this.cca3ToCommonNames(country.borders || []),
          })),
        ),
      );
  }

  private cca3ToCommonNames(cca3Countries: string[]) {
    return this.countries()
      .filter((country: Country) => cca3Countries.includes(country.cca3))
      .map((country: Country) => country.name.common);
  }
}

