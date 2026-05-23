import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { CountryService } from '../../core/service/country.service';
import { Country } from '../../shared/types/countries.model';

@Component({
  selector: 'app-country-list',
  standalone: false,
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit, OnDestroy {
  countries = signal<Country[]>([]);
  filteredCountries = signal<Country[]>([]);
  loading = signal(false);
  subscription = new Subscription();

  filterForm = new UntypedFormGroup({
    search: new UntypedFormControl(''),
    region: new UntypedFormControl(''),
    sortBy: new UntypedFormControl('name'),
  });

  readonly regions = [
    'Africa',
    'Americas',
    'Antarctic',
    'Asia',
    'Europe',
    'Oceania',
  ];

  readonly sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Population', value: 'population' },
    { label: 'Area', value: 'area' },
  ];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadCountries();

    this.subscription.add(
      this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
        this.applyFilters();
      }),
    );
  }

  loadCountries(): void {
    this.loading.set(true);
    this.subscription.add(
      this.countryService
        .getAll()
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((data: Country[]) => {
          this.countries.set(data);
          this.filteredCountries.set(data);
          this.applyFilters();
        }),
    );
  }

  applyFilters(): void {
    let result = [...this.countries()];

    const searchTerm = this.filterForm.get('search')!.value;
    if (searchTerm) {
      result = result.filter((country: Country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    const region = this.filterForm.get('region')!.value;
    if (region) {
      result = result.filter((country: Country) => country.region === region);
    }

    const sortBy = this.filterForm.get('sortBy')!.value;
    if (sortBy === 'name') {
      result.sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common),
      );
    } else if (sortBy === 'population') {
      result.sort((a: Country, b: Country) => b.population - a.population);
    } else if (sortBy === 'area') {
      result.sort((a: Country, b: Country) => b.area - a.area);
    }

    this.filteredCountries.set(result);
  }

  clearFilters(): void {
    this.filterForm.get('search')!.setValue('');
    this.filterForm.get('region')!.setValue('');
    this.filterForm.get('sortBy')!.setValue('name');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

