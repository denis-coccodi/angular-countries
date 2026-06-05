import { Component, input, model } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormValueControl } from '@angular/forms/signals';
import { of } from 'rxjs';
import { CountryListComponent } from './country-list.component';
import { CountryService } from '../../core/service/country.service';
import { Country } from '../../shared/types/countries.model';
import { PDropdownComponent } from '../../shared/primeng-wrappers/dropdown/p-dropdown.component';
import { PInputTextComponent } from '../../shared/primeng-wrappers/input-text/p-input-text.component';
import { CountryCardComponent } from '../../shared/ui/country-card/country-card.component';
import { makeCountry } from '../../shared/utils/jest.utils';

@Component({
  selector: 'app-p-input-text',
  template: '<input>',
  standalone: true,
})
class PInputTextStub implements FormValueControl<string> {
  readonly id = input('');
  readonly ariaLabel = input('');
  readonly placeholder = input('');
  readonly value = model('');
  readonly disabled = input(false);
}

@Component({
  selector: 'app-p-dropdown',
  template: '<select></select>',
  standalone: true,
})
class PDropdownStub implements FormValueControl<unknown> {
  readonly id = input('');
  readonly options = input<unknown[]>([]);
  readonly placeholder = input('');
  readonly optionLabel = input('');
  readonly optionValue = input('');
  readonly showClear = input(false);
  readonly value = model<unknown>(null);
  readonly disabled = input(false);
}

@Component({ selector: 'app-country-card', template: '<div class="card-stub"></div>', standalone: true })
class CountryCardStub {
  readonly country = input<unknown>();
  readonly displayedInfo = input<unknown>();
}

const make = (common: string, region: string, population: number, area: number): Country =>
  makeCountry({
    name: { common, official: common, nativeName: {} },
    cca3: common.substring(0, 3).toUpperCase(),
    region,
    population,
    area,
  });

describe('CountryListComponent', () => {
  let fixture: ComponentFixture<CountryListComponent>;
  let component: CountryListComponent;
  let mockService: jest.Mocked<Pick<CountryService, 'getAll'>>;

  const COUNTRIES: Country[] = [
    make('Albania', 'Europe', 2000000, 28748),
    make('Brazil', 'Americas', 215000000, 8515767),
    make('Chad', 'Africa', 17000000, 1284000),
    make('Denmark', 'Europe', 5900000, 42924),
  ];

  beforeEach(async () => {
    mockService = { getAll: jest.fn().mockReturnValue(of([...COUNTRIES])) };

    await TestBed.configureTestingModule({
      imports: [CountryListComponent],
      providers: [{ provide: CountryService, useValue: mockService }],
    })
      .overrideComponent(CountryListComponent, {
        remove: { imports: [PInputTextComponent, PDropdownComponent, CountryCardComponent] },
        add: { imports: [PInputTextStub, PDropdownStub, CountryCardStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CountryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setSearch = (search: string) =>
    component.filterModel.update((f) => ({ ...f, search }));
  const setRegion = (region: string) =>
    component.filterModel.update((f) => ({ ...f, region }));
  const setSortBy = (value: 'name' | 'population' | 'area') => {
    const sortBy = component.sortOptions.find((o) => o.value === value)!;
    component.filterModel.update((f) => ({ ...f, sortBy }));
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial load', () => {
    it('should call getAll on init', () => {
      expect(mockService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should populate filteredCountries after loading', () => {
      expect(component.filteredCountries().length).toBe(COUNTRIES.length);
    });

    it('should set loading to false after data arrives', () => {
      expect(component.loading()).toBe(false);
    });
  });

  describe('search filter', () => {
    it('should filter countries by search term (case-insensitive)', fakeAsync(() => {
      setSearch('alb');
      tick(300);

      const names = component.filteredCountries().map((c) => c.name.common);
      expect(names).toEqual(['Albania']);
    }));

    it('should show all countries when search is cleared', fakeAsync(() => {
      setSearch('alb');
      tick(300);
      setSearch('');
      tick(300);

      expect(component.filteredCountries().length).toBe(COUNTRIES.length);
    }));
  });

  describe('region filter', () => {
    it('should filter countries by region', fakeAsync(() => {
      setRegion('Europe');
      tick(300);

      const names = component.filteredCountries().map((c) => c.name.common);
      expect(names).toContain('Albania');
      expect(names).toContain('Denmark');
      expect(names).not.toContain('Brazil');
    }));
  });

  describe('sort', () => {
    it('should sort by name (default)', fakeAsync(() => {
      setSortBy('name');
      tick(300);

      const names = component.filteredCountries().map((c) => c.name.common);
      expect(names).toEqual([...names].sort());
    }));

    it('should sort by population descending', fakeAsync(() => {
      setSortBy('population');
      tick(300);

      const populations = component.filteredCountries().map((c) => c.population);
      expect(populations[0]).toBeGreaterThan(populations[1]);
    }));

    it('should sort by area descending', fakeAsync(() => {
      setSortBy('area');
      tick(300);

      const areas = component.filteredCountries().map((c) => c.area);
      expect(areas[0]).toBeGreaterThan(areas[1]);
    }));
  });

  describe('clearFilters()', () => {
    it('should reset search, region, and sortBy to defaults', fakeAsync(() => {
      const populationOption = component.sortOptions.find((o) => o.value === 'population')!;
      const nameOption = component.sortOptions.find((o) => o.value === 'name')!;
      component.filterModel.set({ search: 'test', region: 'Africa', sortBy: populationOption });
      tick(300);

      component.clearFilters();

      expect(component.filterModel()).toEqual({ search: '', region: '', sortBy: nameOption });
    }));

    it('should restore all countries after clearing filters', fakeAsync(() => {
      setSearch('alb');
      tick(300);
      expect(component.filteredCountries().length).toBe(1);

      component.clearFilters();
      tick(300);
      expect(component.filteredCountries().length).toBe(COUNTRIES.length);
    }));
  });

  describe('regions and sortOptions', () => {
    it('should expose all six regions', () => {
      expect(component.regions).toEqual(['Africa', 'Americas', 'Antarctic', 'Asia', 'Europe', 'Oceania']);
    });

    it('should expose name, population, and area sort options', () => {
      const values = component.sortOptions.map((o) => o.value);
      expect(values).toContain('name');
      expect(values).toContain('population');
      expect(values).toContain('area');
    });
  });

  describe('combined filters', () => {
    it('should apply search and region filter simultaneously', fakeAsync(() => {
      component.filterModel.update((f) => ({ ...f, search: 'a', region: 'Europe' }));
      tick(300);

      const results = component.filteredCountries();
      expect(results.every((c) => c.region === 'Europe')).toBe(true);
      expect(results.every((c) => c.name.common.toLowerCase().includes('a'))).toBe(true);
    }));
  });
});
