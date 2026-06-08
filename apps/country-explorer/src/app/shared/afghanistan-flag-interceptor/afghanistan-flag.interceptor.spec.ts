import {
    HTTP_INTERCEPTORS,
    HttpClient,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Country } from '@country-explorer/types/backend';
import { makeCountry } from '../utils/jest.utils';
import { AfghanistanFlagInterceptor } from './afghanistan-flag.interceptor';

const AFGHANISTAN_OFFICIAL = 'Islamic Republic of Afghanistan';
const REPLACEMENT_PNG = 'https://flagcdn.com/w320/af.png';

const make = (official: string, png = 'original.png') =>
  makeCountry({
    name: { common: 'Test', official, nativeName: {} },
    flags: { png, svg: '', alt: '' },
  });

describe('AfghanistanFlagInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AfghanistanFlagInterceptor,
          multi: true,
        },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('should replace the flag PNG for Afghanistan', () => {
    const body = [make(AFGHANISTAN_OFFICIAL, 'old-flag.png')];
    let result: Country[];

    http.get<Country[]>('/api/countries').subscribe((res) => {
      result = res;
      expect(result[0].flags.png).toBe(REPLACEMENT_PNG);
    });
    controller.expectOne('/api/countries').flush(body);
  });

  it('should not modify other country flags', () => {
    const body = [make('Federal Republic of Germany', 'germany.png')];
    let result: Country[];

    http.get<Country[]>('/api/countries').subscribe((res) => {
      result = res;

      expect(result[0].flags.png).toBe('germany.png');
    });
    controller.expectOne('/api/countries').flush(body);
  });

  it('should only replace the flag PNG, preserving other flag properties', () => {
    const body = [make(AFGHANISTAN_OFFICIAL, 'old.png')];
    (body[0].flags as { png: string; svg: string }).svg = 'af.svg';
    let result: Country[];

    http.get<Country[]>('/api/countries').subscribe((res) => {
      result = res;

      expect(result[0].flags.png).toBe(REPLACEMENT_PNG);
      expect(result[0].flags.svg).toBe('af.svg');
    });
    controller.expectOne('/api/countries').flush(body);
  });

  it('should handle multiple countries and only replace Afghanistan', () => {
    const body = [
      make('Federal Republic of Germany', 'de.png'),
      make(AFGHANISTAN_OFFICIAL, 'old-af.png'),
      make('French Republic', 'fr.png'),
    ];
    let result: Country[];

    http.get('/api/countries').subscribe((res) => (result = res as Country[]));
    controller.expectOne('/api/countries').flush(body);

    expect(result![0].flags.png).toBe('de.png');
    expect(result![1].flags.png).toBe(REPLACEMENT_PNG);
    expect(result![2].flags.png).toBe('fr.png');
  });

  it('should pass through non-array responses unchanged', () => {
    const body = { name: 'single country' };
    let result: Country[];

    http.get<Country[]>('/api/country').subscribe((res) => {
      result = res;

      expect(result).toEqual(body);
    });
    controller.expectOne('/api/country').flush(body);
  });
});
