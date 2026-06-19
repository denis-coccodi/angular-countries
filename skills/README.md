# Angular 22 Skills Index

This directory contains AI coding-assistant skills tailored to this project.
They capture Angular 22 best practices and project-specific conventions.

## Skills

| File | Topic | Status in Angular 22 |
|------|--------|-----------------------|
| [angular-signals-resource.md](./angular-signals-resource.md) | `httpResource`, `rxResource`, `resource` APIs | ✅ Stable (21: dev-preview) |
| [angular-signal-forms.md](./angular-signal-forms.md) | Signal Forms — `form()`, `FormRoot`, `FormField` | ✅ Stable (21: dev-preview) |
| [angular-onpush-change-detection.md](./angular-onpush-change-detection.md) | OnPush default, zone-less setup | ✅ Default in v22 |
| [angular-modern-component-patterns.md](./angular-modern-component-patterns.md) | Standalone, `inject()`, `@if`/`@for`, `@defer`, `computed()`, `effect()` | ✅ All stable |
| [nx-workspace-conventions.md](./nx-workspace-conventions.md) | Nx 22 monorepo structure, library placement, barrel exports | ✅ Current |

## Key Angular 22 Highlights (vs Current Angular 21)

| Change | Angular 21 | Angular 22 |
|--------|-----------|-----------|
| `OnPush` | Explicit opt-in | **Default** for new components |
| Resource API | Developer-preview | **Stable** |
| Signal Forms | Developer-preview | **Stable** |
| HTTP default | `XMLHttpRequest` | **Fetch API** |
| TypeScript | ~5.9 | **6.x required** |
| Node.js | 20+ | **26 required** |
| Webpack | Supported | **Deprecated** |

## Migration Notes for This Codebase

1. **`CountryListComponent`** — replace `Subscription` + `ngOnInit`/`ngOnDestroy` with `rxResource(() => this.allService.get())`.
2. **`app.config.ts`** — `provideZoneChangeDetection()` should eventually become `provideExperimentalZonelessChangeDetection()`.
3. **`AppComponent`** — no `changeDetection` set; add `OnPush` explicitly.
4. All new feature components should use signal inputs (`input()`) and `@if`/`@for` control flow.
