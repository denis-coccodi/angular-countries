import { Component, input, model } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormValueControl } from '@angular/forms/signals';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { makeCountry, makeFullCountry } from '@app/shared/utils/jest.utils';
import { AllService, AlphaService } from '@country-explorer/rest-countries-api';
import { Country } from '@country-explorer/types/backend';
import { CountryCardComponent, PMultiselectComponent } from '@country-explorer/ui-kit';
import { Observable, of } from 'rxjs';
import { CompareCountriesComponent } from './compare-countries.component';
import { CompareCountriesStore } from './data-access';

@Component({
  selector: 'app-p-multiselect',
  template: '',
  standalone: true,
})
class PMultiselectStub implements FormValueControl<unknown[]> {
  readonly id = input('');
  readonly options = input<unknown[]>([]);
  readonly placeholder = input('');
  readonly showClear = input(false);
  readonly filter = input(false);
  readonly selectionLimit = input(0);
  readonly value = model<unknown[]>([]);
  readonly disabled = input(false);
}

@Component({ selector: 'app-country-card', template: '', standalone: true })
class CountryCardStub {
  readonly country = input<unknown>();
  readonly displayedInfo = input<unknown>();
}

const DEU = makeCountry({ name: { common: 'Germany', official: 'Germany', nativeName: {} }, cca3: 'DEU' });
const FRA = makeCountry({ name: { common: 'France', official: 'France', nativeName: {} }, cca3: 'FRA' });

type AllServiceStub = { get: jest.Mock };
type AlphaServiceStub = { getByCodes: jest.Mock };

type RouterStub = { navigate: jest.Mock };
type RouteStub = {
  snapshot: { queryParamMap: { get: (key: string) => string | null } };
  queryParamMap: Observable<ParamMap>;
};

interface SetupOptions {
  getAllReturns?: Country[];
  queryParam?: string | null;
  getByCodesReturns?: Country[];
}

async function setup(opts: SetupOptions = {}): Promise<{
  fixture: ComponentFixture<CompareCountriesComponent>;
  component: CompareCountriesComponent;
  allService: AllServiceStub;
  alphaService: AlphaServiceStub;
  router: RouterStub;
  route: RouteStub;
}> {
  const allService: AllServiceStub = {
    get: jest.fn().mockReturnValue(of(opts.getAllReturns ?? [DEU, FRA])),
  };
  const alphaService: AlphaServiceStub = {
    getByCodes: jest.fn().mockReturnValue(of(opts.getByCodesReturns ?? [])),
  };
  const router: RouterStub = { navigate: jest.fn().mockResolvedValue(true) };
  const queryParamValue = opts.queryParam ?? null;
  const route: RouteStub = {
    snapshot: {
      queryParamMap: {
        get: (key: string) => (key === 'countries' ? queryParamValue : null),
      },
    },
    queryParamMap: of(
      convertToParamMap(queryParamValue == null ? {} : { countries: queryParamValue }),
    ),
  };

  await TestBed.configureTestingModule({
    imports: [CompareCountriesComponent],
    providers: [
      { provide: AllService, useValue: allService },
      { provide: AlphaService, useValue: alphaService },
      CompareCountriesStore,
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
  await fixture.whenStable();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return { fixture, component, allService, alphaService, router, route };
}

describe('CompareCountriesComponent', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call AllService.get on init', async () => {
      const { allService } = await setup();
      expect(allService.get).toHaveBeenCalledTimes(1);
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

  describe('selectionModel changes', () => {
    it('should call AlphaService.getByCodes with the selected country codes', async () => {
      const fullDeu = makeFullCountry(DEU);
      const { fixture, component, alphaService } = await setup({ getByCodesReturns: [fullDeu] });

      component.selectionModel.set([DEU]);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(alphaService.getByCodes).toHaveBeenCalledWith(['DEU']);
    });

    it('should update selectedCountries with the fetched full countries', async () => {
      const fullDeu = makeFullCountry(DEU);
      const { fixture, component } = await setup({ getByCodesReturns: [fullDeu] });

      component.selectionModel.set([DEU]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.selectedCountries()).toEqual([{ ...fullDeu, borders: ['France'] }]);
    });

    it('should set selectedCountries to empty without calling getByCodes when selection is empty', async () => {
      const { fixture, component, alphaService } = await setup();

      component.selectionModel.set([]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(alphaService.getByCodes).not.toHaveBeenCalled();
      expect(component.selectedCountries()).toEqual([]);
    });

    it('should map border CCA3 codes to country common names using the loaded list', async () => {
      const fullDeu = { ...makeFullCountry(DEU), borders: ['FRA'] };
      const { fixture, component } = await setup({
        getAllReturns: [DEU, FRA],
        getByCodesReturns: [fullDeu],
      });

      component.selectionModel.set([DEU]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.selectedCountries()[0].borders).toEqual(['France']);
    });
  });

  describe('query param restoration', () => {
    it('should restore the selection from the countries query param after getAll resolves', async () => {
      const fullDeu = makeFullCountry(DEU);
      const { component, alphaService } = await setup({
        getAllReturns: [DEU, FRA],
        queryParam: 'DEU',
        getByCodesReturns: [fullDeu],
      });

      expect(component.selectionModel()).toEqual([DEU]);
      expect(alphaService.getByCodes).toHaveBeenCalledWith(['DEU']);
      expect(component.selectedCountries()).toEqual([{ ...fullDeu, borders: ['France'] }]);
    });

    it('should restore multiple codes preserving the alphabetical order of the loaded country list', async () => {
      const { component } = await setup({
        getAllReturns: [DEU, FRA],
        queryParam: 'FRA,DEU',
      });

      expect(component.selectionModel()).toEqual([FRA, DEU]);
    });

    it('should ignore unknown codes in the query param', async () => {
      const { component, alphaService } = await setup({
        getAllReturns: [DEU, FRA],
        queryParam: 'ZZZ',
      });

      expect(component.selectionModel()).toEqual([]);
      expect(alphaService.getByCodes).not.toHaveBeenCalled();
    });

    it('should leave the selection empty when there is no countries query param', async () => {
      const { component, alphaService } = await setup({ getAllReturns: [DEU, FRA] });

      expect(component.selectionModel()).toEqual([]);
      expect(alphaService.getByCodes).not.toHaveBeenCalled();
    });
  });

  describe('query param sync', () => {
    it('should write the cca3 codes to the URL when the selection changes', async () => {
      const { fixture, component, router, route } = await setup();

      component.selectionModel.set([DEU, FRA]);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { countries: 'DEU,FRA' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    it('should clear the countries query param when the selection becomes empty', async () => {
      const { fixture, component, router, route } = await setup({
        getAllReturns: [DEU, FRA],
        queryParam: 'DEU',
      });
      router.navigate.mockClear();

      component.selectionModel.set([]);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { countries: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  });
});
