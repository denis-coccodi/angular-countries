import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CountryCardComponent } from './country-card.component';
import { Country, FullCountry } from '../../types/countries.model';
import { makeCountry, makeFullCountry } from '../../utils/jest.utils';

describe('CountryCardComponent', () => {
  let fixture: ComponentFixture<CountryCardComponent>;
  let component: CountryCardComponent;
  let el: HTMLElement;

  const create = (country: Country | FullCountry = makeCountry()) => {
    fixture = TestBed.createComponent(CountryCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('country', country);
    fixture.detectChanges();
    el = fixture.nativeElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    create();
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should display the country name', () => {
      create();
      expect(el.querySelector('.card-title')?.textContent?.trim()).toBe('Germany');
    });

    it('should render the flag image with correct src and alt', () => {
      create();
      const img = el.querySelector<HTMLImageElement>('img');
      expect(img?.src).toContain('de.png');
      expect(img?.alt).toBe('Flag of Germany');
    });

    it('should render one row per displayed property', () => {
      create();
      const rows = el.querySelectorAll('.info-row');
      expect(rows.length).toBe(5); // default: population, region, capital, currencies, languages
    });
  });

  describe('getPopulation()', () => {
    it('should format millions with one decimal place and M suffix', () => {
      create(makeCountry({ population: 83000000 }));
      expect(component.getPopulation()).toBe('83.0M');
    });

    it('should format thousands with one decimal place and K suffix', () => {
      create(makeCountry({ population: 50000 }));
      expect(component.getPopulation()).toBe('50.0K');
    });

    it('should return raw number as string for small populations', () => {
      create(makeCountry({ population: 800 }));
      expect(component.getPopulation()).toBe('800');
    });

    it('should use exactly 1000001 as the millions threshold', () => {
      create(makeCountry({ population: 1000001 }));
      expect(component.getPopulation()).toContain('M');
    });

    it('should use exactly 1001 as the thousands threshold', () => {
      create(makeCountry({ population: 1001 }));
      expect(component.getPopulation()).toContain('K');
    });
  });

  describe('getCurrencies()', () => {
    it('should return currency names joined by comma', () => {
      create(makeCountry({
        currencies: { EUR: { name: 'Euro', symbol: '€' }, USD: { name: 'US Dollar', symbol: '$' } },
      }));
      const result = component.getCurrencies();
      expect(result).toContain('Euro');
      expect(result).toContain('US Dollar');
    });

    it('should return N/A when currencies is falsy', () => {
      create(makeCountry({ currencies: undefined as any }));
      expect(component.getCurrencies()).toBe('N/A');
    });

    it('should return a single currency name without trailing comma', () => {
      create();
      expect(component.getCurrencies()).toBe('Euro');
    });
  });

  describe('getLanguages()', () => {
    it('should return language names joined by comma', () => {
      create(makeCountry({ languages: { deu: 'German', eng: 'English' } }));
      const result = component.getLanguages();
      expect(result).toContain('German');
      expect(result).toContain('English');
    });

    it('should return N/A when languages is falsy', () => {
      create(makeCountry({ languages: undefined as any }));
      expect(component.getLanguages()).toBe('N/A');
    });

    it('should return a single language without trailing comma', () => {
      create();
      expect(component.getLanguages()).toBe('German');
    });
  });

  describe('infoMap computed', () => {
    it('should respect the displayedInfo input', () => {
      fixture = TestBed.createComponent(CountryCardComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('country', makeCountry());
      fixture.componentRef.setInput('displayedInfo', ['region', 'area']);
      fixture.detectChanges();

      const map = component.infoMap();
      expect(map.length).toBe(2);
      expect(map[0].label).toBe('Region');
      expect(map[0].value).toBe('Europe');
      expect(map[1].label).toBe('Area');
      expect(map[1].value).toContain('357');
    });

    it('should show timezones for FullCountry', () => {
      const full = makeFullCountry({ timezones: ['UTC+01:00', 'UTC+02:00'] });
      fixture = TestBed.createComponent(CountryCardComponent);
      fixture.componentRef.setInput('country', full);
      fixture.componentRef.setInput('displayedInfo', ['timezones']);
      fixture.detectChanges();

      const map = fixture.componentInstance.infoMap();
      expect(map[0].value).toBe('UTC+01:00, UTC+02:00');
    });

    it('should show N/A for timezones on base Country', () => {
      fixture = TestBed.createComponent(CountryCardComponent);
      fixture.componentRef.setInput('country', makeCountry());
      fixture.componentRef.setInput('displayedInfo', ['timezones']);
      fixture.detectChanges();

      const map = fixture.componentInstance.infoMap();
      expect(map[0].value).toBe('N/A');
    });

    it('should show "None" for borders when empty', () => {
      fixture = TestBed.createComponent(CountryCardComponent);
      fixture.componentRef.setInput('country', makeCountry({ borders: [] }));
      fixture.componentRef.setInput('displayedInfo', ['borders']);
      fixture.detectChanges();

      const map = fixture.componentInstance.infoMap();
      expect(map[0].value).toBe('None');
    });

    it('should show "N/A" for capital when empty', () => {
      fixture = TestBed.createComponent(CountryCardComponent);
      fixture.componentRef.setInput('country', makeCountry({ capital: [] }));
      fixture.componentRef.setInput('displayedInfo', ['capital']);
      fixture.detectChanges();

      const map = fixture.componentInstance.infoMap();
      expect(map[0].value).toBe('N/A');
    });
  });
});
