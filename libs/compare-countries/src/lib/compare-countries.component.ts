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
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Country, FullCountry } from '@country-explorer/types/backend';
import { AllService, AlphaService } from '@country-explorer/rest-countries-api';
import {
  CountryCardComponent,
  CountryCardProperty,
  PMultiselectComponent,
} from '@country-explorer/ui-kit';

const MAXIMUM_COMPARABLE_COUNTRIES = 3;

@Component({
  selector: 'app-compare-countries',
  standalone: true,
  imports: [FormRoot, FormField, PMultiselectComponent, CountryCardComponent],
  templateUrl: './compare-countries.component.html',
  styleUrl: './compare-countries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareCountriesComponent {
  private allService = inject(AllService);
  private alphaService = inject(AlphaService);
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

  readonly selectedCountriesResource = rxResource({
    params: () => this.selectionModel().map((c) => c.cca3),
    stream: ({ params: codes }) => {
      if (!codes || codes.length === 0) {
        return of([]);
      }
      return this.alphaService.getByCodes(codes).pipe(
        map((countries: FullCountry[]) =>
          countries.map((country) => ({
            ...country,
            borders: this.cca3ToCommonNames(country.borders || []),
          })),
        ),
      );
    },
  });

  readonly selectedCountries = computed(() => this.selectedCountriesResource.value() ?? []);

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

  private cca3ToCommonNames(cca3Countries: string[]): string[] {
    return this.countries()
      .filter((country) => cca3Countries.includes(country.cca3))
      .map((country) => country.name.common);
  }
}
