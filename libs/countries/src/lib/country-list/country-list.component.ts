import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { CountriesStore } from '@country-explorer/countries-data-access';
import { Country } from '@country-explorer/types/backend';
import {
  CountryCardComponent,
  PDropdownComponent,
  PInputTextComponent,
} from '@country-explorer/ui-kit';

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
  imports: [
    FormRoot,
    FormField,
    PInputTextComponent,
    PDropdownComponent,
    CountryCardComponent,
    JsonPipe,
  ],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent {
  private readonly countriesStore = inject(CountriesStore);

  readonly countries = this.countriesStore.countries;
  readonly loading = this.countriesStore.loading;

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

  readonly regions = ['Africa', 'Americas', 'Antarctic', 'Asia', 'Europe', 'Oceania'];

  readonly sortOptions = SORT_OPTIONS;

  clearFilters(): void {
    this.filterModel.set({ ...DEFAULT_FILTERS });
  }

  strs = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];

  getSortedStrs(strs: string[]): Array<{ original: string; sorted: string }> {
    return strs.map((str) => ({
      original: str,
      sorted: [...str].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0)).join(''),
    }));
  }

  getAnagrams(
    referenceString: string,
    sortedStrObjects: Array<{ original: string; sorted: string }>
  ) {
    return sortedStrObjects.reduce(
      (acc, str) => [...acc, ...(referenceString === str.sorted ? [str.original] : [])],
      [] as Array<string>
    );
  }

  stripAnagramDuplicates(
    referenceString: string,
    sortedStrObjects: Array<{ original: string; sorted: string }>
  ) {
    return sortedStrObjects.filter((strObject) => strObject.sorted !== referenceString);
  }

  getAnagramsMap(strs: Array<string>) {
    let sortedStrObjs: Array<{ original: string; sorted: string }> = this.getSortedStrs(strs);
    let sortedStrsMap = new Map<string, Array<string>>(
      sortedStrObjs.map((sortedStrObj) => [sortedStrObj.sorted, []])
    );

    for (const key of sortedStrsMap.keys()) {
      const result = this.getAnagrams(key, sortedStrObjs);
      sortedStrObjs = this.stripAnagramDuplicates(key, sortedStrObjs);

      sortedStrsMap.set(key, result);
    }

    return Array.from(sortedStrsMap.values());
  }
}
