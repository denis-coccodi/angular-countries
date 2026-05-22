import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { CountryService } from '../core/service/country.service';
import { Country } from '../shared/types/countries.model';

@Component({
  selector: 'app-compare-countries',
  standalone: false,
  templateUrl: './compare-countries.component.html',
  styleUrl: './compare-countries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareCountriesComponent implements OnInit {
  // Injections
  countriesService = inject(CountryService);

  // State
  countries = this.countriesService.countries;
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

  ngOnInit(): void {
    if (this.countries().length === 0) {
      this.countriesService.getAll().subscribe((countries) => {
        this.countries.set(countries);
      });
    }
  }

  onCountrySelectionChange(event: Country[]): void {
    this.selectedCountriesForm.get('countries')?.setValue(event);
  }
}

