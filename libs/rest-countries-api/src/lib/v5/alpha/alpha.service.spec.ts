import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AlphaService } from './alpha.service';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

describe('AlphaService', () => {
  let service: AlphaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REST_COUNTRIES_API_BASE_URL, useValue: 'https://api.restcountries.com/countries/v5' },
      ],
    });
    service = TestBed.inject(AlphaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('getByCode()', () => {
    it('should GET /codes.alpha_3/{code}', () => {
      service.getByCode('DEU').subscribe();
      const req = http.expectOne('https://api.restcountries.com/countries/v5/codes.alpha_3/DEU');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getByCodes()', () => {
    it('should fan out to one request per code and flatten the results', () => {
      const results: Array<{ cca3: string }> = [];
      service.getByCodes(['DEU', 'FRA']).subscribe((countries) =>
        results.push(...(countries as Array<{ cca3: string }>)),
      );

      http
        .expectOne('https://api.restcountries.com/countries/v5/codes.alpha_3/DEU')
        .flush([{ cca3: 'DEU' }]);
      http
        .expectOne('https://api.restcountries.com/countries/v5/codes.alpha_3/FRA')
        .flush([{ cca3: 'FRA' }]);

      expect(results.map((c) => c.cca3)).toEqual(['DEU', 'FRA']);
    });

    it('should not issue a request for an empty code list', () => {
      let result: unknown[] = [{ untouched: true }];
      service.getByCodes([]).subscribe((countries) => (result = countries));
      http.expectNone(() => true);
      expect(result).toEqual([]);
    });
  });
});
