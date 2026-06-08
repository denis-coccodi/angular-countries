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
        { provide: REST_COUNTRIES_API_BASE_URL, useValue: 'https://restcountries.com/v3.1' },
      ],
    });
    service = TestBed.inject(AlphaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('getByCode()', () => {
    it('should GET /v3.1/alpha/{code}', () => {
      service.getByCode('DEU').subscribe();
      const req = http.expectOne('https://restcountries.com/v3.1/alpha/DEU');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getByCodes()', () => {
    it('should GET /v3.1/alpha?codes=... with codes joined by comma', () => {
      service.getByCodes(['DEU', 'FRA']).subscribe();
      const req = http.expectOne('https://restcountries.com/v3.1/alpha?codes=DEU,FRA');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });
});
