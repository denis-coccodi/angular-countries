import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
  selectedCountries = signal<Country[]>([]);

  // Computed
  countryOptions = computed(() =>
    this.countries().map((country) => ({
      label: country.name.common,
      value: country,
    })),
  );

  ngOnInit(): void {
    if (this.countries().length === 0) {
      this.countriesService.getAll().subscribe((countries) => {
        this.countries.set(countries);
      });
    }
  }

  onCountrySelectionChange(event: Country[]): void {
    console.log(event);
    this.selectedCountries.set(event);
  }
}
