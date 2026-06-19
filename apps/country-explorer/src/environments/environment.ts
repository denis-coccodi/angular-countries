export const environment = {
  production: true,
  // Relative path: requests hit the dev-server origin and are proxied to the
  // REST Countries v5 API, which injects the Authorization header server-side
  // (see apps/country-explorer/proxy.conf.json). The v5 API requires an API key
  // and would otherwise be blocked by CORS when called directly from the browser.
  restCountriesApiBaseUrl: '/countries/v5',
};
