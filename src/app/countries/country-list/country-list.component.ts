import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, signal, inject } from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CountryService } from '../../core/service/country.service';
import { Country } from '../../shared/types/countries.model';
import { CountryCardComponent } from '../../shared/ui/country-card/country-card.component';
import { PDropdownComponent } from '../../shared/primeng-wrappers/dropdown/p-dropdown.component';
import { PInputTextComponent } from '../../shared/primeng-wrappers/input-text/p-input-text.component';

type SortBy = 'name' | 'population' | 'area';

interface SortOption {
  readonly label: string;
  readonly value: SortBy;
}

const SORT_OPTIONS: readonly SortOption[] = [
  { label: 'Name', value: 'name' },
  { label: 'Population', value: 'population' },
  { label: 'Area', value: 'area' },
];

interface FilterModel {
  search: string;
  region: string;
  sortBy: SortOption;
}

const DEFAULT_FILTERS: FilterModel = { search: '', region: '', sortBy: SORT_OPTIONS[0] };

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [FormRoot, FormField, PInputTextComponent, PDropdownComponent, CountryCardComponent],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit, OnDestroy {
  private countryService = inject(CountryService);

  countries = signal<Country[]>([]);
  loading = signal(false);
  subscription = new Subscription();

  filterModel = signal<FilterModel>({ ...DEFAULT_FILTERS });
  filterForm = form(this.filterModel);

  filteredCountries = computed<Country[]>(() => {
    const { search, region, sortBy } = this.filterModel();
    let result = [...this.countries()];

    if (search) {
      const term = search.toLowerCase();
      result = result.filter((country) => country.name.common.toLowerCase().includes(term));
    }

    if (region) {
      result = result.filter((country) => country.region === region);
    }

    if (sortBy.value === 'name') {
      result.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (sortBy.value === 'population') {
      result.sort((a, b) => b.population - a.population);
    } else if (sortBy.value === 'area') {
      result.sort((a, b) => b.area - a.area);
    }

    return result;
  });

  readonly regions = [
    'Africa',
    'Americas',
    'Antarctic',
    'Asia',
    'Europe',
    'Oceania',
  ];

  readonly sortOptions = SORT_OPTIONS;

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.loading.set(true);
    this.subscription.add(
      this.countryService
        .getAll()
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((data: Country[]) => this.countries.set(data)),
    );
  }

  clearFilters(): void {
    this.filterModel.set({ ...DEFAULT_FILTERS });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
