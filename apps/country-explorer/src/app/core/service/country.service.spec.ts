import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CountryService } from './country.service';
import { Country, FullCountry } from '@country-explorer/types/backend';
import { makeCountry } from '../../shared/utils/jest.utils';

const make = (common: string, cca3: string, overrides: Partial<Country> = {}): Country =>
  makeCountry({
    name: { common, official: common, nativeName: {} },
    flags: { png: `${cca3}.png`, svg: '', alt: '' },
    cca3,
    ...overrides,
  });

describe('CountryService', () => {
  let service: CountryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CountryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should fetch from the correct endpoint', () => {
      service.getAll().subscribe();
      const req = http.expectOne((r) =>
        r.url.startsWith('https://restcountries.com/v3.1/all'),
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should request the required fields', () => {
      service.getAll().subscribe();
      const req = http.expectOne((r) => r.url.includes('/all'));
      expect(req.request.urlWithParams).toContain('fields=');
      req.flush([]);
    });

    it('should return countries sorted alphabetically by common name', () => {
      const raw = [make('Zimbabwe', 'ZWE'), make('Albania', 'ALB'), make('Mexico', 'MEX')];
      let result: Country[] = [];

      service.getAll().subscribe((data) => (result = data));
      http.expectOne((r) => r.url.includes('/all')).flush(raw);

      expect(result.map((c) => c.name.common)).toEqual(['Albania', 'Mexico', 'Zimbabwe']);
    });

    it('should store sorted countries in the countries signal', () => {
      const raw = [make('Zimbabwe', 'ZWE'), make('Albania', 'ALB')];

      service.getAll().subscribe();
      http.expectOne((r) => r.url.includes('/all')).flush(raw);

      expect(service.countries()[0].name.common).toBe('Albania');
      expect(service.countries()[1].name.common).toBe('Zimbabwe');
    });
  });

  describe('getByCode()', () => {
    it('should fetch from the correct endpoint', () => {
      service.getByCode('DEU').subscribe();
      const req = http.expectOne('https://restcountries.com/v3.1/alpha/DEU');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('searchByName()', () => {
    it('should fetch from the correct endpoint', () => {
      service.searchByName('germany').subscribe();
      const req = http.expectOne('https://restcountries.com/v3.1/name/germany');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getByRegion()', () => {
    it('should fetch from the correct endpoint', () => {
      service.getByRegion('Europe').subscribe();
      const req = http.expectOne('https://restcountries.com/v3.1/region/Europe');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getByCodes()', () => {
    it('should fetch from the correct endpoint with codes joined by comma', () => {
      service.getByCodes(['DEU', 'FRA']).subscribe();
      const req = http.expectOne('https://restcountries.com/v3.1/alpha?codes=DEU,FRA');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should map border CCA3 codes to country common names using the cached signal', () => {
      // Seed the countries signal by first calling getAll
      const cached = [make('France', 'FRA'), make('Austria', 'AUT')];
      service.getAll().subscribe();
      http.expectOne((r) => r.url.includes('/all')).flush(cached);

      const fullCountry = {
        ...make('Germany', 'DEU', { borders: [] }),
        borders: ['FRA', 'AUT'],
        timezones: ['UTC+01:00'],
      } as unknown as FullCountry;

      let result: FullCountry[] = [];
      service.getByCodes(['DEU']).subscribe((data) => (result = data));
      http.expectOne((r) => r.url.includes('/alpha?codes=')).flush([fullCountry]);

      // cca3ToCommonNames preserves the signal's alphabetical order
      expect(result[0].borders).toEqual(['Austria', 'France']);
    });

    it('should leave borders as empty array when no cached countries match', () => {
      const fullCountry = {
        ...make('Germany', 'DEU', { borders: [] }),
        borders: ['XYZ'],
        timezones: [],
      } as unknown as FullCountry;

      let result: FullCountry[] = [];
      service.getByCodes(['DEU']).subscribe((data) => (result = data));
      http.expectOne((r) => r.url.includes('/alpha?codes=')).flush([fullCountry]);

      expect(result[0].borders).toEqual([]);
    });
  });
});
