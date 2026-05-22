import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-country-card',
  standalone: false,
  templateUrl: './country-card.component.html'
})
export class CountryCardComponent {

  @Input() country: any;

  constructor(private router: Router) { }

  getPopulation(): string {
    if (this.country.population > 1000000) {
      return (this.country.population / 1000000).toFixed(1) + 'M';
    } else if (this.country.population > 1000) {
      return (this.country.population / 1000).toFixed(1) + 'K';
    }
    return this.country.population.toString();
  }

  getCurrencies(): string {
    if (!this.country.currencies) return 'N/A';
    return Object.values(this.country.currencies)
      .map((c: any) => c.name)
      .join(', ');
  }

  getLanguages(): string {
    if (!this.country.languages) return 'N/A';
    return Object.values(this.country.languages).join(', ');
  }

  onCardClick(): void {
    console.log('Country clicked:', this.country.name.common);
  }
}
