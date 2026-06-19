# Skill: Angular 22 — Modern Component Patterns

## Overview
Angular 22 solidifies the "signal-first" paradigm. This skill covers the canonical patterns for building components that are idiomatic, forward-compatible, and optimised for this codebase.

---

## Standalone Components (Required)

All components in this project are standalone. **Never** use `NgModule`.

```typescript
@Component({
  selector: 'app-country-card',
  standalone: true,
  imports: [/* only what you need */],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryCardComponent { }
```

---

## Input / Output with Signals

### Signal Inputs (Angular 17+, preferred)
```typescript
import { input, output } from '@angular/core';

export class CountryCardComponent {
  // Required input
  country = input.required<Country>();

  // Optional input with default
  highlighted = input(false);

  // Output
  selected = output<Country>();

  onSelect(): void {
    this.selected.emit(this.country());
  }
}
```

### Template Usage
```html
<app-country-card
  [country]="c"
  [highlighted]="true"
  (selected)="onCountrySelected($event)"
/>
```

---

## `inject()` in the Constructor Body

Always use `inject()` — never use constructor parameter injection:

```typescript
// ✅ Correct
export class MyService {
  private http    = inject(HttpClient);
  private baseUrl = inject(REST_COUNTRIES_API_BASE_URL);
}

// ❌ Avoid
export class MyService {
  constructor(private http: HttpClient) {}
}
```

---

## Control Flow Syntax (Angular 17+ @-syntax)

Always use the new template control flow. **Never use `*ngIf`, `*ngFor`, `*ngSwitch`**.

```html
<!-- Conditional -->
@if (isLoading()) {
  <p>Loading…</p>
} @else if (error()) {
  <p class="error">Error: {{ error() }}</p>
} @else {
  <!-- content -->
}

<!-- Loop -->
@for (country of countries(); track country.cca3) {
  <app-country-card [country]="country" />
} @empty {
  <p>No countries found.</p>
}

<!-- Switch -->
@switch (status()) {
  @case ('loading') { <app-spinner /> }
  @case ('error')   { <app-error-message /> }
  @default          { <app-country-list /> }
}
```

---

## Deferred Loading with `@defer`

Use `@defer` for lazy-loading heavy components (e.g., detail panels, charts):

```html
@defer (on viewport) {
  <app-country-detail [country]="selectedCountry()" />
} @placeholder {
  <div class="skeleton" aria-hidden="true"></div>
} @loading (minimum 200ms) {
  <app-spinner />
} @error {
  <p>Failed to load details.</p>
}
```

---

## `computed()` for Derived State

Prefer `computed()` over methods in templates for derived values:

```typescript
// ✅ Computed signal — memoised, re-runs only when dependencies change
readonly filteredCountries = computed(() => {
  const { search, region, sortBy } = this.filterModel();
  return this.countries()
    .filter(c => !search || c.name.common.toLowerCase().includes(search.toLowerCase()))
    .filter(c => !region || c.region === region)
    .sort(comparators[sortBy.value]);
});
```

```html
<!-- Template just reads the signal -->
@for (country of filteredCountries(); track country.cca3) { ... }
```

---

## `effect()` for Side Effects

Use `effect()` instead of `ngOnChanges` or `valueChanges` subscriptions:

```typescript
import { effect } from '@angular/core';

export class MyComponent {
  constructor() {
    effect(() => {
      // Runs reactively when any tracked signal changes
      console.log('Filter changed:', this.filterModel());
    });
  }
}
```

> Use sparingly — prefer `computed()` where possible. `effect()` is for side effects only (analytics, logging, external DOM manipulation).

---

## Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class CountriesStore {
  private http = inject(HttpClient);

  // Public readable signal — expose minimum surface area
  readonly countriesResource = rxResource({
    loader: () => this.http.get<Country[]>('/api/countries'),
  });
}
```

---

## Rules
- **Standalone only** — no `NgModule`, no `declarations`.
- **`inject()`** — no constructor parameter injection.
- **`@if` / `@for` / `@switch`** — no structural directives (`*ngIf`, `*ngFor`).
- **Signal inputs** — use `input()` and `input.required()` instead of `@Input()`.
- **Signal outputs** — use `output()` instead of `@Output() EventEmitter`.
- **`computed()`** — for all derived state; avoid method calls in templates.
- **`effect()`** — only for side-effects; never to sync state between signals.
- **`OnPush`** — always.
- **`@defer`** — for any component or section not needed on first paint.
