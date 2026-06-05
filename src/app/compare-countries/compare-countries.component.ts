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
import { CountryService } from '../core/service/country.service';
import { PMultiselectComponent } from '../shared/primeng-wrappers/multiselect/p-multiselect.component';
import { Country } from '../shared/types/countries.model';
import {
  CountryCardComponent,
  CountryCardProperty,
} from '../shared/ui/country-card/country-card.component';

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
  // Injections
  countriesService = inject(CountryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // State
  countries = this.countriesService.countries;
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
    if (this.countries().length === 0) {
      this.subscriptions.add(
        this.countriesService.getAll().subscribe((countries) => {
          this.countries.set(countries);
          this.watchQueryParams();
        }),
      );
    } else {
      this.watchQueryParams();
    }
  }

  private watchQueryParams(): void {
    this.subscriptions.add(
      this.route.queryParamMap.subscribe((params) => {
        const paramStr = params.get('countries') ?? '';
        const currentStr = this.selectionModel()
          .map((c) => c.cca3)
          .join(',');
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
        this.countriesService
          .getByCodes(selectedCountriesCodes)
          .subscribe((countries) => {
            this.selectedCountries.set(countries);
          }),
      );
    } else {
      this.selectedCountries.set(event);
    }
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
