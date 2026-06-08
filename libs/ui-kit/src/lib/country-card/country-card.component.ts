import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Country, FullCountry, isFullCountry } from '@country-explorer/types/backend';
import { countryCardPropertyDetail } from '@country-explorer/types/frontend';

export type CountryCardProperty =
  | 'population'
  | 'region'
  | 'capital'
  | 'currencies'
  | 'languages'
  | 'area'
  | 'timezones'
  | 'borders';

@Component({
  selector: 'app-country-card',
  standalone: true,
  imports: [],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryCardComponent {
  private router = inject(Router);

  country = input.required<Country | FullCountry>();
  displayedInfo = input<CountryCardProperty[]>([
    'population',
    'region',
    'capital',
    'currencies',
    'languages',
  ]);

  infoMap = computed<countryCardPropertyDetail[]>(() => {
    const displayedInfo = this.displayedInfo();
    const country = this.country();

    return displayedInfo.reduce<countryCardPropertyDetail[]>(
      (acc, info) => [
        ...acc,
        {
          label: info.charAt(0).toUpperCase() + info.slice(1),
          value:
            info === 'population'
              ? this.getPopulation()
              : info === 'region'
              ? country.region
              : info === 'capital'
              ? country.capital?.join(', ') || 'N/A'
              : info === 'currencies'
              ? this.getCurrencies()
              : info === 'languages'
              ? this.getLanguages()
              : info === 'area'
              ? `${country.area?.toLocaleString()} km²`
              : info === 'timezones'
              ? isFullCountry(country) ? country.timezones.join(', ') || 'N/A' : 'N/A'
              : info === 'borders'
              ? country.borders?.join(', ') || 'None'
              : 'N/A',
        },
      ],
      [],
    );
  });

  getPopulation(): string {
    const { population } = this.country();
    if (population > 1000000) {
      return (population / 1000000).toFixed(1) + 'M';
    } else if (population > 1000) {
      return (population / 1000).toFixed(1) + 'K';
    }
    return population.toString();
  }

  getCurrencies(): string {
    const { currencies } = this.country();
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map((c) => c.name)
      .join(', ');
  }

  getLanguages(): string {
    const { languages } = this.country();
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  }

  onCardClick(): void {
    const country = this.country();
    console.log('Country clicked:', country.name.common, country);
  }
}

