import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NameService } from './name.service';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

describe('NameService', () => {
  let service: NameService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REST_COUNTRIES_API_BASE_URL, useValue: 'https://api.restcountries.com/countries/v5' },
      ],
    });
    service = TestBed.inject(NameService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should GET /name with the search term as the q query param', () => {
    service.search('germany').subscribe();
    const req = http.expectOne(
      (r) =>
        r.url === 'https://api.restcountries.com/countries/v5/name' &&
        r.params.get('q') === 'germany',
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
