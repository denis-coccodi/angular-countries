# Skill: Angular Resource API (Stable in Angular 22)

## Overview
The Resource API (`resource`, `rxResource`, `httpResource`) is **stable in Angular 22** and is the recommended way to load asynchronous data reactively using Signals. It replaces manual subscriptions, `isLoading` flags, and `ngOnDestroy` cleanup in many common cases.

> **This project is on Angular 21.** The APIs are available but marked developer-preview.
> Target Angular 22 patterns when writing new code so upgrades are frictionless.

---

## When to Use Each API

| API | Use When |
|-----|----------|
| `httpResource()` | Simple GET requests via `HttpClient` (interceptors included) |
| `rxResource()` | You have an existing Observable-based service |
| `resource()` | Custom `fetch`/Promise-based loaders |

All three are for **data retrieval (GET) only** — not mutations (POST/PUT/DELETE).

---

## `httpResource` — Simplest Approach

```typescript
import { Component, signal, inject } from '@angular/core';
import { httpResource } from '@angular/core/rxjs-interop';
import { Country } from '@country-explorer/types/backend';

@Component({ /* ... */ })
export class CountryListComponent {
  // Reactive param — re-fetches automatically when it changes
  readonly region = signal('');

  readonly countriesResource = httpResource<Country[]>(
    () => `https://restcountries.com/v3.1/all?fields=name,flags,region,population`,
  );

  // Derived signals — no subscriptions needed
  readonly countries = this.countriesResource.value;   // Signal<Country[] | undefined>
  readonly isLoading = this.countriesResource.isLoading; // Signal<boolean>
  readonly error    = this.countriesResource.error;      // Signal<unknown>
}
```

### Reactive URL with a signal dependency
```typescript
readonly cca3 = signal('DEU');

readonly countryResource = httpResource<Country>(
  () => `https://restcountries.com/v3.1/alpha/${this.cca3()}`,
);
```
The resource re-fetches whenever `cca3` changes. Previous in-flight requests are cancelled automatically.

---

## `rxResource` — Bridge for Existing Services

Use this to wrap existing `AllService`, `AlphaService`, etc., without rewriting them.

```typescript
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AllService } from '@country-explorer/rest-countries-api';
import { Country } from '@country-explorer/types/backend';

@Component({ /* ... */ })
export class CountryListComponent {
  private allService = inject(AllService);

  readonly countriesResource = rxResource({
    loader: () => this.allService.get(),
  });

  readonly countries = computed(() => this.countriesResource.value() ?? []);
  readonly isLoading = this.countriesResource.isLoading;
}
```

### With a reactive parameter
```typescript
readonly cca3 = signal('DEU');

readonly countryResource = rxResource({
  request: () => this.cca3(),              // tracked signal
  loader: ({ request }) => this.alphaService.getByCode(request),
});
```

---

## Template Patterns

```html
<!-- Loading / error / content states -->
@if (countriesResource.isLoading()) {
  <p>Loading…</p>
} @else if (countriesResource.error()) {
  <p class="error">Failed to load countries.</p>
} @else {
  @for (country of countriesResource.value(); track country.cca3) {
    <app-country-card [country]="country" />
  }
}
```

---

## ResourceSnapshot (Angular 21.2+)

Observe the full lifecycle as a single reactive signal:

```typescript
import { ResourceStatus } from '@angular/core';

readonly snapshot = this.countriesResource.asReadonly(); // ResourceRef → resource

// Use status enum for fine-grained state
readonly status = this.countriesResource.status;
// Possible values: ResourceStatus.Idle | Loading | Resolved | Error | Local
```

---

## Migrating from the Subscription Pattern

### Before (current codebase pattern)
```typescript
export class CountryListComponent implements OnInit, OnDestroy {
  countries = signal<Country[]>([]);
  loading   = signal(false);
  subscription = new Subscription();

  ngOnInit() {
    this.loading.set(true);
    this.subscription.add(
      this.allService.get()
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe(data => this.countries.set(data)),
    );
  }

  ngOnDestroy() { this.subscription.unsubscribe(); }
}
```

### After (Angular 22 style)
```typescript
export class CountryListComponent {
  private allService = inject(AllService);

  readonly countriesResource = rxResource({
    loader: () => this.allService.get(),
  });

  readonly countries = computed(() => this.countriesResource.value() ?? []);
  readonly isLoading = this.countriesResource.isLoading;

  // No ngOnInit, no ngOnDestroy, no Subscription management
}
```

---

## Rules
- Prefer `rxResource` when wrapping existing services (`AllService`, `AlphaService`, etc.).
- Prefer `httpResource` for brand-new HTTP calls that don't need a dedicated service.
- Never use `resource` / `rxResource` / `httpResource` for mutations — use `HttpClient` directly.
- Always provide fallback with `computed(() => resource.value() ?? [])` to avoid `undefined` in templates.
- Use `@if (resource.isLoading())` and `@if (resource.error())` for state management in templates.
