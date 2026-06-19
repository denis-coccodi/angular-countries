import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RegionService } from './region.service';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

describe('RegionService', () => {
  let service: RegionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REST_COUNTRIES_API_BASE_URL, useValue: 'https://api.restcountries.com/countries/v5' },
      ],
    });
    service = TestBed.inject(RegionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should GET /region/{region}', () => {
    service.getByRegion('Europe').subscribe();
    const req = http.expectOne('https://api.restcountries.com/countries/v5/region/Europe');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
