import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { makeCountry } from '@app/shared/utils/jest.utils';
import { AllService } from '@country-explorer/rest-countries-api';
import { Country } from '@country-explorer/types/backend';
import { of, throwError } from 'rxjs';
import { CountriesStore } from './countries.store';

@Component({
  standalone: true,
  template: '',
})
class HostComponent {}

const COUNTRIES: Country[] = [
  makeCountry({ name: { common: 'Albania', official: 'Albania', nativeName: {} }, cca3: 'ALB', region: 'Europe' }),
  makeCountry({ name: { common: 'Brazil', official: 'Brazil', nativeName: {} }, cca3: 'BRA', region: 'Americas' }),
];

const REFRESHED_COUNTRIES: Country[] = [
  makeCountry({ name: { common: 'Chile', official: 'Chile', nativeName: {} }, cca3: 'CHL', region: 'Americas' }),
];

describe('CountriesStore', () => {
  let fixture: ComponentFixture<HostComponent>;
  let store: any;
  let allService: jest.Mocked<Pick<AllService, 'get'>>;

  beforeEach(async () => {
    allService = {
      get: jest.fn().mockReturnValue(of([...COUNTRIES])),
    };

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: AllService, useValue: allService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    store = TestBed.inject(CountriesStore);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should load countries on init', () => {
    expect(allService.get).toHaveBeenCalledTimes(1);
    expect(store.countries()).toEqual(COUNTRIES);
    expect(store.loading()).toBe(false);
    expect(store.loaded()).toBe(true);
    expect(store.error()).toBeNull();
  });

  it('should reload countries when refreshCountries is called', async () => {
    allService.get.mockReturnValueOnce(of([...REFRESHED_COUNTRIES]));

    store.refreshCountries();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(allService.get).toHaveBeenCalledTimes(2);
    expect(store.countries()).toEqual(REFRESHED_COUNTRIES);
  });

  it('should surface a readable error when loading fails', async () => {
    allService.get.mockReturnValueOnce(throwError(() => new Error('boom')));

    store.refreshCountries();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(store.error()).toBe('boom');
    expect(store.loading()).toBe(false);
  });
});