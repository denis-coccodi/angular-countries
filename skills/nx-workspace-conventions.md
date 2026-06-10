# Skill: Angular 22 — Nx Workspace Conventions

## Overview
This project uses an **Nx 22** monorepo with Angular 21. These rules ensure code is correctly placed within library boundaries and aligned with Nx best practices.

---

## Project Structure

```
apps/
  country-explorer/          ← App shell (routing, config, styles)
libs/
  countries/                 ← Feature: country list, filtering
  compare-countries/         ← Feature: country comparison
  rest-countries-api/        ← Data access: HttpClient services
  types/                     ← Shared TypeScript interfaces (no Angular deps)
  ui-kit/                    ← Shared UI components (presentational only)
```

---

## Library Placement Rules

| What | Where |
|------|-------|
| New pages / features | `libs/<feature-name>/src/lib/` |
| HTTP services (GET only) | `libs/rest-countries-api/src/lib/v3-1/<endpoint>/` |
| Shared presentational components | `libs/ui-kit/src/lib/` |
| TypeScript interfaces / types | `libs/types/src/` |
| App config, providers, routes | `apps/country-explorer/src/app/` |

---

## Adding a New Feature Library (Nx CLI)

```bash
# Generate a new library
npx nx g @nx/angular:library <lib-name> --standalone --no-module

# Generate a component inside a lib
npx nx g @nx/angular:component <name> --project=<lib-name> --standalone
```

---

## Barrel Exports

Every library **must** export its public API through `src/index.ts`:

```typescript
// libs/countries/src/index.ts
export { CountryListComponent } from './lib/country-list/country-list.component';
```

Import from the public alias, **never** from a deep path:

```typescript
// ✅ Correct
import { CountryListComponent } from '@country-explorer/countries';

// ❌ Wrong
import { CountryListComponent } from '../../libs/countries/src/lib/country-list/country-list.component';
```

---

## Nx Path Aliases

Path aliases follow the pattern `@country-explorer/<lib-name>` and are defined in `tsconfig.json`. When creating a new library, ensure the alias is registered:

```json
// tsconfig.json (paths section)
{
  "paths": {
    "@country-explorer/countries": ["libs/countries/src/index.ts"],
    "@country-explorer/types/backend": ["libs/types/src/index.ts"],
    "@country-explorer/ui-kit": ["libs/ui-kit/src/index.ts"],
    "@country-explorer/rest-countries-api": ["libs/rest-countries-api/src/index.ts"]
  }
}
```

---

## Running Tasks

```bash
# Serve the app (dev)
npm start               # → nx serve country-explorer

# Run all tests
npm test                # → jest

# Run a single library's tests
npx nx test countries

# Build for production
npm run build

# Check affected libs (CI)
npx nx affected --target=test
```

---

## Rules
- **Feature code** belongs in `libs/`, not in `apps/`.
- **`apps/`** only contains: shell component, routing, `app.config.ts`, global styles.
- Always import from `@country-explorer/<lib-name>` — never from relative deep paths.
- Export new components/services from the library's `src/index.ts`.
- Use `npx nx g` to generate files so `project.json` is updated correctly.
- Keep `libs/types` free of Angular dependencies — plain TypeScript only.
- Keep `libs/ui-kit` free of HTTP / state — presentational only.
