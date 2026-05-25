import { Component, forwardRef, Input, signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of } from 'rxjs';
import { CompareCountriesComponent } from './compare-countries.component';
import { CountryService } from '../core/service/country.service';
import { Country } from '../shared/types/countries.model';
import { CountryCardComponent } from '../shared/ui/country-card/country-card.component';
import { PMultiselectComponent } from '../shared/primeng-wrappers/multiselect/p-multiselect.component';
import { makeCountry, makeFullCountry } from '../shared/utils/jest.utils';

@Component({
  selector: 'app-p-multiselect',
  template: '',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PMultiselectStub), multi: true }],
})
class PMultiselectStub implements ControlValueAccessor {
  @Input() id = '';
  @Input() options: unknown[] = [];
  @Input() placeholder = '';
  writeValue() {}
  registerOnChange() {}
  registerOnTouched() {}
}

@Component({ selector: 'app-country-card', template: '', standalone: true })
class CountryCardStub {
  @Input() country: unknown;
  @Input() displayedInfo: unknown;
}

describe('CompareCountriesComponent', () => {
  let fixture: ComponentFixture<CompareCountriesComponent>;
  let component: CompareCountriesComponent;
  let countriesSignal: ReturnType<typeof signal<Country[]>>;
  let mockService: {
    countries: ReturnType<typeof signal<Country[]>>;
    getAll: jest.Mock;
    getByCodes: jest.Mock;
  };

  const DEU = makeCountry({ name: { common: 'Germany', official: 'Germany', nativeName: {} }, cca3: 'DEU' });
  const FRA = makeCountry({ name: { common: 'France', official: 'France', nativeName: {} }, cca3: 'FRA' });

  beforeEach(async () => {
    countriesSignal = signal<Country[]>([]);
    mockService = {
      countries: countriesSignal,
      getAll: jest.fn().mockReturnValue(of([DEU, FRA])),
      getByCodes: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [CompareCountriesComponent],
      providers: [{ provide: CountryService, useValue: mockService }],
    })
      .overrideComponent(CompareCountriesComponent, {
        remove: { imports: [PMultiselectComponent, CountryCardComponent] },
        add: { imports: [PMultiselectStub, CountryCardStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CompareCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call getAll when countries signal is empty', () => {
      expect(mockService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('when countries are already loaded', () => {
    let preloadedService: typeof mockService;

    beforeEach(async () => {
      TestBed.resetTestingModule();

      const preloadedSignal = signal<Country[]>([DEU, FRA]);
      preloadedService = {
        countries: preloadedSignal,
        getAll: jest.fn(),
        getByCodes: jest.fn().mockReturnValue(of([])),
      };

      await TestBed.configureTestingModule({
        imports: [CompareCountriesComponent],
        providers: [{ provide: CountryService, useValue: preloadedService }],
      })
        .overrideComponent(CompareCountriesComponent, {
          remove: { imports: [PMultiselectComponent, CountryCardComponent] },
          add: { imports: [PMultiselectStub, CountryCardStub] },
        })
        .compileComponents();

      const f = TestBed.createComponent(CompareCountriesComponent);
      f.detectChanges();
    });

    it('should not call getAll', () => {
      expect(preloadedService.getAll).not.toHaveBeenCalled();
    });
  });

  describe('countryOptions computed', () => {
    it('should map loaded countries to label/value options', () => {
      // getAll resolves synchronously via of(), so signal is populated after detectChanges
      const options = component.countryOptions();
      expect(options.length).toBe(2);
      expect(options[0]).toEqual({ label: 'Germany', value: DEU });
      expect(options[1]).toEqual({ label: 'France', value: FRA });
    });
  });

  describe('selectedProperties', () => {
    it('should default to the full set of comparison properties', () => {
      const props = component.selectedProperties();
      expect(props).toContain('region');
      expect(props).toContain('population');
      expect(props).toContain('area');
      expect(props).toContain('capital');
      expect(props).toContain('timezones');
      expect(props).toContain('currencies');
      expect(props).toContain('languages');
      expect(props).toContain('borders');
    });
  });

  describe('onCountrySelectionChange()', () => {
    it('should call getByCodes with the selected country codes', fakeAsync(() => {
      const fullDeu = makeFullCountry(DEU);
      mockService.getByCodes.mockReturnValue(of([fullDeu]));

      component.onCountrySelectionChange([DEU]);
      tick();

      expect(mockService.getByCodes).toHaveBeenCalledWith(['DEU']);
    }));

    it('should update the selectedCountriesForm with the fetched full countries', fakeAsync(() => {
      const fullDeu = makeFullCountry(DEU);
      mockService.getByCodes.mockReturnValue(of([fullDeu]));

      component.onCountrySelectionChange([DEU]);
      tick();

      expect(component.selectedCountriesForm.get('countries')?.value).toEqual([fullDeu]);
    }));

    it('should set form to empty selection without calling getByCodes when selection is empty', fakeAsync(() => {
      component.onCountrySelectionChange([]);
      tick();

      expect(mockService.getByCodes).not.toHaveBeenCalled();
      expect(component.selectedCountriesForm.get('countries')?.value).toEqual([]);
    }));
  });
});
