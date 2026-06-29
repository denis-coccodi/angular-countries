import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { AllService } from '@country-explorer/rest-countries-api';
import {
  CountryCardComponent,
  CountryCardProperty,
  PMultiselectComponent,
} from '@country-explorer/ui-kit';
import { map } from 'rxjs/operators';
import { CompareCountriesStore } from './data-access';

const MAXIMUM_COMPARABLE_COUNTRIES = 3;

@Component({
  selector: 'app-compare-countries',
  standalone: true,
  imports: [FormRoot, FormField, PMultiselectComponent, CountryCardComponent],
  templateUrl: './compare-countries.component.html',
  styleUrl: './compare-countries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': "'100%'",
  }
})
export class CompareCountriesComponent {
  private allService = inject(AllService);
  private compareCountriesStore = inject(CompareCountriesStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly countriesResource = rxResource({
    stream: () => this.allService.get().pipe(
      map((countries) => countries.sort((a, b) => a.name.common.localeCompare(b.name.common)))
    )
  });
  readonly countries = computed(() => this.countriesResource.value() ?? []);

  readonly queryParamMap = toSignal(this.route.queryParamMap);

  readonly selectionModel = linkedSignal(() => {
    const params = this.queryParamMap();
    if (!params) return [];
    const paramStr = params.get('countries') ?? '';
    const codes = paramStr
      .split(',')
      .filter(Boolean)
      .map((code) => code.toUpperCase());
    return this.countries()
      .filter((c) => codes.includes(c.cca3))
      .slice(0, MAXIMUM_COMPARABLE_COUNTRIES);
  });

  selectionForm = form(this.selectionModel);
  readonly selectedCountries = this.compareCountriesStore.selectedCountries;

  selectedProperties = signal<CountryCardProperty[]>([
    'region',
    'population',
    'area',
    'capital',
    'timezones',
    'currencies',
    'languages',
    'borders',
  ]);

  MAXIMUM_COMPARABLE_COUNTRIES = MAXIMUM_COMPARABLE_COUNTRIES;

  constructor() {
    effect(() => {
      this.compareCountriesStore.setAvailableCountries(this.countries());
    });

    effect(() => {
      this.compareCountriesStore.setSelectedCodes(this.selectionModel().map((country) => country.cca3));
    });

    // Reactively sync the current selection back to the URL query params.
    // This effect re-runs whenever selectionModel or queryParamMap changes.
    effect(() => {
      const selection = this.selectionModel();
      const codes = selection.map((c) => c.cca3);

      // Read the current URL state so we can compare before writing.
      const params = this.queryParamMap();
      const currentParamStr = params?.get('countries') ?? '';
      const currentCodes = currentParamStr.split(',').filter(Boolean);

      // Guard: only navigate if the selection actually differs from the URL,
      // preventing redundant history entries when the URL drives the selection.
      const hasChanged =
        codes.length !== currentCodes.length ||
        codes.some((c, idx) => c !== currentCodes[idx]);

      if (hasChanged) {
        // untracked prevents the router.navigate call from being tracked as a
        // signal dependency, which would otherwise cause an infinite loop.
        untracked(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { countries: codes.length ? codes.join(',') : null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        });
      }
    });
  }
}
