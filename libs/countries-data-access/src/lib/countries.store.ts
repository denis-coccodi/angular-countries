import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AllService } from '@country-explorer/rest-countries-api';
import { Country } from '@country-explorer/types/backend';
import { signalStore, withMethods } from '@ngrx/signals';

export interface CountriesState {
  countries: Country[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Failed to load countries.';
}

export const CountriesStore = signalStore(
  { providedIn: 'root' },
  withMethods((store, allService = inject(AllService)) => {
    const countriesResource = rxResource({
      stream: () => allService.get(),
    });

    return {
      countries: computed(() => countriesResource.value() ?? []),
      loading: countriesResource.isLoading,
      error: computed(() => {
        const error = countriesResource.error();
        return error ? getErrorMessage(error) : null;
      }),
      loaded: computed(() => countriesResource.value() !== undefined),
      refreshCountries(): void {
        countriesResource.reload();
      },
    };
  }),
);