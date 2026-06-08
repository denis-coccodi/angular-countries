import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AllService } from './all.service';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

describe('AllService', () => {
  let service: AllService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REST_COUNTRIES_API_BASE_URL, useValue: 'https://restcountries.com/v3.1' },
      ],
    });
    service = TestBed.inject(AllService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should GET /v3.1/all with the required fields query param', () => {
    service.get().subscribe();
    const req = http.expectOne((r) =>
      r.url.startsWith('https://restcountries.com/v3.1/all'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('fields=');
    req.flush([]);
  });
});
