# Skill: Angular 22 — OnPush Default & Change Detection

## Overview
In **Angular 22**, `OnPush` is the **default change detection strategy** for all new components.
The old `Default` strategy has been renamed to `ChangeDetectionStrategy.Eager`.

> **This project is on Angular 21** — components still use `ChangeDetectionStrategy.OnPush` explicitly.
> When generating new components, always include `OnPush` explicitly for clarity and forward-compatibility.

---

## New Components — Always Use OnPush Explicitly

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,  // ← Always include
  template: `...`,
})
export class MyComponent { }
```

---

## Why OnPush Works Great with Signals

Signals integrate directly with the Angular change detection graph. When a signal used in a template changes, only the **affected component and its subtree** re-render — even without `markForCheck()`.

```typescript
// ✅ This just works with OnPush — no zone.js triggers needed
readonly countries = this.countriesResource.value;   // Signal<Country[] | undefined>
readonly isLoading = this.countriesResource.isLoading; // Signal<boolean>
```

---

## Trigger Zone-based Updates Manually (when needed)

If mixing zone.js APIs (event listeners, setTimeout, etc.) inside an `OnPush` component, inject `ChangeDetectorRef`:

```typescript
import { ChangeDetectorRef, inject } from '@angular/core';

export class MyComponent {
  private cdr = inject(ChangeDetectorRef);

  onExternalEvent(): void {
    // do work...
    this.cdr.markForCheck(); // trigger CD for this component and ancestors
  }
}
```

---

## Zone-less Setup (Angular 22 Target)

Angular 22 encourages eliminating `zone.js`. In `app.config.ts`, use:

```typescript
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), // replaces provideZoneChangeDetection()
    // ... other providers
  ],
};
```

> ⚠️ Only do this if all async triggers (HTTP, timers, user events) are signal-based or handled via `async/await` with no implicit zone tracking.

---

## Rules
- **Always** add `changeDetection: ChangeDetectionStrategy.OnPush` to every new component.
- **Never** use `ChangeDetectionStrategy.Default` in new code — it's `Eager` in Angular 22 and implies no signal-awareness.
- Prefer Signals over Observables in templates so change detection is automatic.
- Avoid calling `detectChanges()` — prefer `markForCheck()` for manual CD when required.
- When all async code uses Signals/Resources, consider removing `zone.js` entirely.
