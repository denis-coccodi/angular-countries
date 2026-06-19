# Skill: Angular Signal Forms (Stable in Angular 22)

## Overview
Signal Forms (`@angular/forms/signals`) replace the traditional `ReactiveFormsModule` with a fully signal-based approach. **This project already uses Signal Forms** via `form()`, `FormRoot`, and `FormField`.

Signal Forms are **stable in Angular 22** (developer-preview in Angular 21).

---

## Core API

| API | Description |
|-----|-------------|
| `form(signal)` | Creates a `FormGroup`-like wrapper bound to a signal |
| `FormRoot` | Directive — binds a form element to the root `form()` instance |
| `FormField` | Directive — binds an input to a specific field in the form |

---

## Basic Pattern (already used in this codebase)

```typescript
import { Component, signal } from '@angular/core';
import { FormRoot, FormField, form } from '@angular/forms/signals';

interface FilterModel {
  search: string;
  region: string;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormRoot, FormField],
  template: `
    <form [form]="filterForm">
      <input [formField]="filterForm.search" placeholder="Search…" />
      <select [formField]="filterForm.region">
        <option value="">All Regions</option>
        <option value="Europe">Europe</option>
      </select>
    </form>
  `,
})
export class FilterComponent {
  readonly filterModel = signal<FilterModel>({ search: '', region: '' });
  readonly filterForm  = form(this.filterModel);

  // filterModel() is always up-to-date — no valueChanges subscription needed
}
```

---

## Reading Form Values

Signal Forms keep the underlying signal in sync automatically:

```typescript
// ✅ Just read the signal — no .value or .getRawValue() 
readonly filtered = computed(() => {
  const { search, region } = this.filterModel();
  return this.countries().filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase()) &&
    (!region || c.region === region)
  );
});
```

---

## Resetting a Form

```typescript
clearFilters(): void {
  // Set the backing signal directly — form updates automatically
  this.filterModel.set({ search: '', region: '' });
}
```

---

## Composing with `linkedSignal`

Use `linkedSignal` to keep a form in sync with data loaded from a Resource:

```typescript
import { linkedSignal, resource } from '@angular/core';

readonly countryResource = rxResource({
  request: () => this.cca3(),
  loader: ({ request }) => this.alphaService.getByCode(request),
});

// Derived, writable signal — resets when resource resolves
readonly editModel = linkedSignal(() =>
  this.countryResource.hasValue()
    ? { ...this.countryResource.value()! }
    : { name: { common: '' }, region: '' }
);

readonly editForm = form(this.editModel);
```

---

## Validation

Signal Forms support validators similar to Reactive Forms:

```typescript
import { form, required, minLength } from '@angular/forms/signals';

readonly searchModel = signal({ query: '' });
readonly searchForm  = form(this.searchModel, {
  validators: {
    query: [required, minLength(2)],
  },
});

// Check validity
readonly isValid = computed(() => this.searchForm.valid());
```

---

## Rules
- **Always** bind `[form]="someForm"` on `<form>` elements — use `FormRoot` directive.
- **Always** bind `[formField]="someForm.fieldName"` on inputs — use `FormField` directive.
- Import both `FormRoot` and `FormField` in the `imports` array of standalone components.
- Read values from the backing signal (e.g. `this.filterModel()`), not from the form object.
- Reset by calling `.set()` on the backing signal — never call `.reset()` on a form group.
- Use `linkedSignal` to synchronise a form with async-loaded data (e.g., a Resource).
- Do **not** mix Signal Forms with `ReactiveFormsModule` (`FormGroup`, `FormControl`) in the same component.
