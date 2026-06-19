import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AlphaService } from '@country-explorer/rest-countries-api';
import { Country, FullCountry } from '@country-explorer/types/backend';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CompareCountriesState {
  availableCountries: Country[];
  selectedCodes: string[];
}

const initialState: CompareCountriesState = {
  availableCountries: [],
  selectedCodes: [],
};

function mapBorderCodesToNames(country: FullCountry, availableCountries: Country[]): FullCountry {
  return {
    ...country,
    borders: availableCountries
      .filter((availableCountry) => (country.borders ?? []).includes(availableCountry.cca3))
      .map((availableCountry) => availableCountry.name.common),
  };
}

export const CompareCountriesStore = signalStore(
  withState(initialState),
  withMethods((store, alphaService = inject(AlphaService)) => {
    const selectedCountriesResource = rxResource({
      params: () => ({
        codes: store.selectedCodes(),
        availableCountriesKey: store.availableCountries().map((country) => country.cca3).join(','),
      }),
      stream: ({ params }) => {
        if (!params.codes.length) {
          return of([]);
        }

        return alphaService.getByCodes(params.codes).pipe(
          map((countries: FullCountry[]) =>
            countries.map((country) => mapBorderCodesToNames(country, store.availableCountries())),
          ),
        );
      },
    });

    return {
      selectedCountries: computed(() => selectedCountriesResource.value() ?? []),
      loading: selectedCountriesResource.isLoading,
      error: selectedCountriesResource.error,
      setAvailableCountries(countries: Country[]): void {
        patchState(store, { availableCountries: countries });
      },
      setSelectedCodes(codes: string[]): void {
        patchState(store, { selectedCodes: codes });
      },
    };
  }),
);