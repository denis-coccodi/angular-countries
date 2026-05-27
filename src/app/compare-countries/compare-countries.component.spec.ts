import { Component, forwardRef, signal, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  readonly id = input('');
  readonly options = input<unknown[]>([]);
  readonly placeholder = input('');
  writeValue() {}
  registerOnChange() {}
  registerOnTouched() {}
}

@Component({ selector: 'app-country-card', template: '', standalone: true })
class CountryCardStub {
  readonly country = input<unknown>();
  readonly displayedInfo = input<unknown>();
}

const DEU = makeCountry({ name: { common: 'Germany', official: 'Germany', nativeName: {} }, cca3: 'DEU' });
const FRA = makeCountry({ name: { common: 'France', official: 'France', nativeName: {} }, cca3: 'FRA' });

type Service = {
  countries: ReturnType<typeof signal<Country[]>>;
  getAll: jest.Mock;
  getByCodes: jest.Mock;
};

type RouterStub = { navigate: jest.Mock };
type RouteStub = { snapshot: { queryParamMap: { get: (key: string) => string | null } } };

interface SetupOptions {
  preloaded?: Country[];
  getAllReturns?: Country[];
  queryParam?: string | null;
  getByCodesReturns?: Country[];
}

async function setup(opts: SetupOptions = {}): Promise<{
  fixture: ComponentFixture<CompareCountriesComponent>;
  component: CompareCountriesComponent;
  service: Service;
  router: RouterStub;
  route: RouteStub;
}> {
  const preloaded = opts.preloaded ?? [];
  const countriesSignal = signal<Country[]>(preloaded);
  const service: Service = {
    countries: countriesSignal,
    getAll: jest.fn().mockReturnValue(of(opts.getAllReturns ?? [DEU, FRA])),
    getByCodes: jest.fn().mockReturnValue(of(opts.getByCodesReturns ?? [])),
  };
  const router: RouterStub = { navigate: jest.fn().mockResolvedValue(true) };
  const route: RouteStub = {
    snapshot: {
      queryParamMap: {
        get: (key: string) => (key === 'countries' ? opts.queryParam ?? null : null),
      },
    },
  };

  await TestBed.configureTestingModule({
    imports: [CompareCountriesComponent],
    providers: [
      { provide: CountryService, useValue: service },
      { provide: Router, useValue: router },
      { provide: ActivatedRoute, useValue: route },
    ],
  })
    .overrideComponent(CompareCountriesComponent, {
      remove: { imports: [PMultiselectComponent, CountryCardComponent] },
      add: { imports: [PMultiselectStub, CountryCardStub] },
    })
    .compileComponents();

  const fixture = TestBed.createComponent(CompareCountriesComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, service, router, route };
}

describe('CompareCountriesComponent', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call getAll when the countries signal is empty', async () => {
      const { service } = await setup();
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });

    it('should not call getAll when countries are already loaded', async () => {
      const { service } = await setup({ preloaded: [DEU, FRA] });
      expect(service.getAll).not.toHaveBeenCalled();
    });
  });

  describe('countryOptions computed', () => {
    it('should map loaded countries to label/value options', async () => {
      const { component } = await setup();
      const options = component.countryOptions();
      expect(options).toEqual([
        { label: 'Germany', value: DEU },
        { label: 'France', value: FRA },
      ]);
    });
  });

  describe('selectedProperties', () => {
    it('should default to the full set of comparison properties', async () => {
      const { component } = await setup();
      expect(component.selectedProperties()).toEqual([
        'region',
        'population',
        'area',
        'capital',
        'timezones',
        'currencies',
        'languages',
        'borders',
      ]);
    });
  });

  describe('onCountrySelectionChange()', () => {
    it('should call getByCodes with the selected country codes', async () => {
      const fullDeu = makeFullCountry(DEU);
      const { component, service } = await setup({ getByCodesReturns: [fullDeu] });

      component.onCountrySelectionChange([DEU]);

      expect(service.getByCodes).toHaveBeenCalledWith(['DEU']);
    });

    it('should update the selectedCountriesForm with the fetched full countries', async () => {
      const fullDeu = makeFullCountry(DEU);
      const { component } = await setup({ getByCodesReturns: [fullDeu] });

      component.onCountrySelectionChange([DEU]);

      expect(component.selectedCountriesForm.get('countries')?.value).toEqual([fullDeu]);
    });

    it('should set form to empty selection without calling getByCodes when selection is empty', async () => {
      const { component, service } = await setup();

      component.onCountrySelectionChange([]);

      expect(service.getByCodes).not.toHaveBeenCalled();
      expect(component.selectedCountriesForm.get('countries')?.value).toEqual([]);
    });
  });

  describe('query param restoration', () => {
    it('should restore the selection from the countries query param when countries are preloaded', async () => {
      const fullDeu = makeFullCountry(DEU);
      const { component, service } = await setup({
        preloaded: [DEU, FRA],
        queryParam: 'DEU',
        getByCodesReturns: [fullDeu],
      });

      expect(component.selectionControl.value).toEqual([DEU]);
      expect(service.getByCodes).toHaveBeenCalledWith(['DEU']);
      expect(component.selectedCountriesForm.get('countries')?.value).toEqual([fullDeu]);
    });

    it('should restore the selection after getAll resolves when countries were not preloaded', async () => {
      const fullFra = makeFullCountry(FRA);
      const { component, service } = await setup({
        queryParam: 'FRA',
        getByCodesReturns: [fullFra],
      });

      expect(component.selectionControl.value).toEqual([FRA]);
      expect(service.getByCodes).toHaveBeenCalledWith(['FRA']);
      expect(component.selectedCountriesForm.get('countries')?.value).toEqual([fullFra]);
    });

    it('should restore multiple codes preserving the order from the available country list', async () => {
      const { component } = await setup({
        preloaded: [DEU, FRA],
        queryParam: 'FRA,DEU',
      });

      expect(component.selectionControl.value).toEqual([DEU, FRA]);
    });

    it('should ignore unknown codes in the query param', async () => {
      const { component, service } = await setup({
        preloaded: [DEU, FRA],
        queryParam: 'ZZZ',
      });

      expect(component.selectionControl.value).toEqual([]);
      expect(service.getByCodes).not.toHaveBeenCalled();
    });

    it('should leave the selection empty when there is no countries query param', async () => {
      const { component, service } = await setup({ preloaded: [DEU, FRA] });

      expect(component.selectionControl.value).toEqual([]);
      expect(service.getByCodes).not.toHaveBeenCalled();
    });
  });

  describe('query param sync', () => {
    it('should write the cca3 codes to the URL when the selection changes', async () => {
      const { component, router, route } = await setup();

      component.selectionControl.setValue([DEU, FRA]);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { countries: 'DEU,FRA' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    it('should clear the countries query param when the selection becomes empty', async () => {
      const { component, router, route } = await setup({
        preloaded: [DEU, FRA],
        queryParam: 'DEU',
      });
      router.navigate.mockClear();

      component.selectionControl.setValue([]);

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { countries: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  });
});
