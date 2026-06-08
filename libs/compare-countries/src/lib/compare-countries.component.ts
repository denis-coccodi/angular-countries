import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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
export class CompareCountriesComponent implements OnInit, OnDestroy {
  private allService = inject(AllService);
  private alphaService = inject(AlphaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  countries = signal<Country[]>([]);
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

  selectionModel = signal<Country[]>([]);
  selectionForm = form(this.selectionModel);

  selectedCountries = signal<Country[]>([]);

  subscriptions = new Subscription();

  MAXIMUM_COMPARABLE_COUNTRIES = MAXIMUM_COMPARABLE_COUNTRIES;

  constructor() {
    effect(() => {
      const selection = this.selectionModel();
      untracked(() => {
        this.onCountrySelectionChange(selection);
        this.syncQueryParams(selection);
      });
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.allService.get().subscribe((countries) => {
        this.countries.set(
          countries.sort((a, b) => a.name.common.localeCompare(b.name.common)),
        );
        this.watchQueryParams();
      }),
    );
  }

  private watchQueryParams(): void {
    this.subscriptions.add(
      this.route.queryParamMap.subscribe((params) => {
        const paramStr = params.get('countries') ?? '';
        const codes = paramStr
          .split(',')
          .filter(Boolean)
          .map((code) => code.toLocaleUpperCase());
        const matched = this.countries()
          .filter((c) => codes.includes(c.cca3))
          .slice(0, MAXIMUM_COMPARABLE_COUNTRIES);
        this.selectionModel.set(matched);
      }),
    );
  }

  onCountrySelectionChange(event: Country[]): void {
    const selectedCountriesCodes = event.map((country) => country.cca3);
    if (selectedCountriesCodes.length) {
      this.subscriptions.add(
        this.alphaService
          .getByCodes(selectedCountriesCodes)
          .pipe(
            map((countries: FullCountry[]) =>
              countries.map((country) => ({
                ...country,
                borders: this.cca3ToCommonNames(country.borders || []),
              })),
            ),
          )
          .subscribe((countries) => {
            this.selectedCountries.set(countries);
          }),
      );
    } else {
      this.selectedCountries.set(event);
    }
  }

  private cca3ToCommonNames(cca3Countries: string[]): string[] {
    return this.countries()
      .filter((country) => cca3Countries.includes(country.cca3))
      .map((country) => country.name.common);
  }

  private syncQueryParams(selected: Country[]): void {
    const codes = selected.map((c) => c.cca3);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { countries: codes.length ? codes.join(',') : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
