import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { makeCountry, makeFullCountry } from '@app/shared/utils/jest.utils';
import { AlphaService } from '@country-explorer/rest-countries-api';
import { of } from 'rxjs';
import { CompareCountriesStore } from './compare-countries.store';

@Component({
  standalone: true,
  template: '',
})
class HostComponent {}

const DEU = makeCountry({
  name: { common: 'Germany', official: 'Germany', nativeName: {} },
  cca3: 'DEU',
  region: 'Europe',
  borders: ['FRA'],
});

const FRA = makeCountry({
  name: { common: 'France', official: 'France', nativeName: {} },
  cca3: 'FRA',
  region: 'Europe',
});

describe('CompareCountriesStore', () => {
  let fixture: ComponentFixture<HostComponent>;
  let store: any;
  let alphaService: jest.Mocked<Pick<AlphaService, 'getByCodes'>>;

  beforeEach(async () => {
    alphaService = {
      getByCodes: jest.fn().mockReturnValue(of([makeFullCountry({ cca3: 'DEU', borders: ['FRA'] })])),
    };

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: AlphaService, useValue: alphaService },
        CompareCountriesStore,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    store = TestBed.inject(CompareCountriesStore);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should start with no selected countries and no API call', () => {
    expect(store.selectedCountries()).toEqual([]);
    expect(alphaService.getByCodes).not.toHaveBeenCalled();
  });

  it('should load selected countries and map border codes to names', async () => {
    store.setAvailableCountries([DEU, FRA]);
    store.setSelectedCodes(['DEU']);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(alphaService.getByCodes).toHaveBeenCalledWith(['DEU']);
    expect(store.selectedCountries()).toEqual([
      makeFullCountry({
        cca3: 'DEU',
        borders: ['France'],
      }),
    ]);
  });

  it('should not call the alpha API when the selection is cleared', async () => {
    store.setAvailableCountries([DEU, FRA]);
    store.setSelectedCodes(['DEU']);
    await fixture.whenStable();
    alphaService.getByCodes.mockClear();

    store.setSelectedCodes([]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(alphaService.getByCodes).not.toHaveBeenCalled();
    expect(store.selectedCountries()).toEqual([]);
  });
});