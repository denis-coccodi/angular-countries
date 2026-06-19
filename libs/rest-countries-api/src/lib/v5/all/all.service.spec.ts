import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AllService } from './all.service';
import { REST_COUNTRIES_API_BASE_URL } from '../base-url';

const BASE = 'https://api.restcountries.com/countries/v5';

describe('AllService', () => {
  let service: AllService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REST_COUNTRIES_API_BASE_URL, useValue: BASE },
      ],
    });
    service = TestBed.inject(AllService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should GET the v5 countries endpoint with limit/offset paging params', () => {
    service.get().subscribe();
    const req = http.expectOne(
      (r) =>
        r.url === BASE &&
        r.params.get('limit') === '100' &&
        r.params.get('offset') === '0',
    );
    expect(req.request.method).toBe('GET');
    // A short page (< limit) ends pagination after a single request.
    req.flush([]);
  });

  it('should keep paging while a full page is returned, then concatenate', () => {
    const results: unknown[] = [];
    service.get().subscribe((countries) => results.push(...countries));

    // First page is full (100) -> service must request the next offset.
    const fullPage = Array.from({ length: 100 }, (_, i) => ({
      cca3: `C${i}`,
    }));
    http
      .expectOne((r) => r.params.get('offset') === '0')
      .flush(fullPage);

    // Second page is short -> pagination stops.
    http
      .expectOne((r) => r.params.get('offset') === '100')
      .flush([{ cca3: 'LAST' }]);

    expect(results).toHaveLength(101);
  });

  it('should drop entries without a cca3 code', () => {
    let result: Array<{ cca3: string }> = [];
    service.get().subscribe((countries) => (result = countries as Array<{ cca3: string }>));

    http
      .expectOne((r) => r.params.get('offset') === '0')
      .flush([{ cca3: 'DEU' }, { cca3: '' }]);

    expect(result.map((c) => c.cca3)).toEqual(['DEU']);
  });
});
