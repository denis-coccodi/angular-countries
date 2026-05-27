import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { CountryService } from '../core/service/country.service';
import { PMultiselectComponent } from '../shared/primeng-wrappers/multiselect/p-multiselect.component';
import { Country } from '../shared/types/countries.model';
import { CountryCardComponent, CountryCardProperty } from '../shared/ui/country-card/country-card.component';

@Component({
  selector: 'app-compare-countries',
  standalone: true,
  imports: [ReactiveFormsModule, PMultiselectComponent, CountryCardComponent],
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
  selectionControl = new FormControl<unknown[]>([]);

  selectedCountriesForm = new FormGroup({
    countries: new FormControl<Country[]>([]),
  });

  // Computed
  countryOptions = computed(() =>
    this.countries().map((country) => ({
      label: country.name.common,
      value: country,
    })),
  );

  selectedCountries = toSignal(
    this.selectedCountriesForm
      .get('countries')!
      .valueChanges.pipe(startWith([])),
    { initialValue: [] },
  );

  subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.selectionControl.valueChanges.subscribe((selection) => {
        const list = (selection ?? []) as Country[];
        this.onCountrySelectionChange(list);
        this.syncQueryParams(list);
      }),
    );

    if (this.countries().length === 0) {
      this.subscriptions.add(
        this.countriesService.getAll().subscribe((countries) => {
          this.countries.set(countries);
          this.restoreSelectionFromQueryParams(countries);
        }),
      );
    } else {
      this.restoreSelectionFromQueryParams(this.countries());
    }
  }

  onCountrySelectionChange(event: Country[]): void {
    const selectedCountriesCodes = event.map((country) => country.cca3);
    if (selectedCountriesCodes.length) {
      this.subscriptions.add(
        this.countriesService
          .getByCodes(selectedCountriesCodes)
          .subscribe((countries) => {
            this.selectedCountriesForm.get('countries')?.setValue(countries);
          }),
      );
    } else {
      this.selectedCountriesForm.get('countries')?.setValue(event);
    }
  }

  private restoreSelectionFromQueryParams(available: Country[]): void {
    const param = this.route.snapshot.queryParamMap.get('countries');
    if (!param) return;
    const codes = param.split(',').filter(Boolean);
    if (!codes.length) return;
    const matched = available.filter((c) => codes.includes(c.cca3));
    if (matched.length) {
      this.selectionControl.setValue(matched);
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

