import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get('https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,currencies,languages,borders,flags,cca3');
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
    return this.http.get('https://restcountries.com/v3.1/alpha?codes=' + codes.join(','));
  }
}
