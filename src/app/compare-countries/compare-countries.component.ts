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
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { CountryService } from '../core/service/country.service';
import { Country } from '../shared/types/countries.model';
import { CountryCardComponent, CountryCardProperty } from '../shared/ui/country-card/country-card.component';
import { PMultiselectComponent } from '../shared/primeng-wrappers/multiselect/p-multiselect.component';

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
    if (this.countries().length === 0) {
      this.subscriptions.add(
        this.countriesService.getAll().subscribe((countries) => {
          this.countries.set(countries);
        }),
      );
    }

    this.subscriptions.add(
      this.selectionControl.valueChanges.subscribe((selection) => {
        this.onCountrySelectionChange((selection ?? []) as Country[]);
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
            this.selectedCountriesForm.get('countries')?.setValue(countries);
          }),
      );
    } else {
      this.selectedCountriesForm.get('countries')?.setValue(event);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

