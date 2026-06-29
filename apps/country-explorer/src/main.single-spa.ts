import { bootstrapApplication, platformBrowser } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { provideSingleSpaPlatform, singleSpaAngular } from 'single-spa-angular';
import { AppComponent } from './app/app.component';
import { singleSpaAppConfig } from './app/app.config.single-spa';

// single-spa entry for Country Explorer. The whole app (including its internal
// router) is exposed as ONE single-spa application; the hub loads this ESM
// bundle and mounts it under the `/country-explorer` route prefix.
//
// `provideSingleSpaPlatform()` installs a single-spa-aware PlatformLocation so
// the app's router and single-spa don't fight over popstate/history events.
const lifecycles = singleSpaAngular({
  bootstrapFunction: () => {
    const platformRef = platformBrowser(provideSingleSpaPlatform());
    return bootstrapApplication(AppComponent, singleSpaAppConfig, { platformRef });
  },
  // The wrapping `.app-theme` element scopes this app's CSS-variable theme to
  // its own subtree so it does not leak into the hub or sibling micro frontends.
  template: '<div class="app-theme"><app-root /></div>',
  // Zoneless: single-spa-angular skips zone-based router/location wiring.
  NgZone: 'noop',
  Router,
  NavigationStart,
});

// The app's global theme is emitted as a sibling `styles.css`. Since this bundle
// is loaded as a bare ESM module (no index.html), inject that stylesheet on
// mount — resolved relative to this module's own URL so it works wherever the
// bundle is served — and remove it on unmount to stay self-contained.
const STYLE_ELEMENT_ID = 'country-explorer-single-spa-styles';
const STYLE_HREF = new URL('styles.css', import.meta.url).href;

function injectStyles(): void {
  if (document.getElementById(STYLE_ELEMENT_ID)) {
    return;
  }
  const link = document.createElement('link');
  link.id = STYLE_ELEMENT_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  document.head.appendChild(link);
}

function removeStyles(): void {
  document.getElementById(STYLE_ELEMENT_ID)?.remove();
}

export const bootstrap = lifecycles.bootstrap;

export async function mount(props: unknown): Promise<unknown> {
  injectStyles();
  return (lifecycles.mount as (p: unknown) => Promise<unknown>)(props);
}

export async function unmount(props: unknown): Promise<unknown> {
  const result = await (lifecycles.unmount as (p: unknown) => Promise<unknown>)(props);
  removeStyles();
  return result;
}
