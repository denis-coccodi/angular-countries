# Country Explorer

An Angular 21 application that displays information about countries worldwide using the [REST Countries API](https://restcountries.com/). Browse, search, and filter countries by region.

- It was started as an angular 18 application using old style modules and upgraded to the latest version of nx/angular using standalone components. 
- PrimeNG was removed entirely and its components were replaced with native versions using Angular Aria.
- Signals and signals stores were added.
- The initial application was divided into sub-libraries as by Nx standard.
- Apis were divided into different services holding no state and placed in a separate library.
- This application started out with v3 remote apis and it's now on v5.
- It is also exposed as a **single-spa micro frontend** so it can be embedded in a portfolio shell alongside other projects (including React/Vue apps).

## Running

Standalone (its own app, hash-routed):

```bash
npm start                 # http://localhost:4200
```

### As a micro frontend

Country Explorer additionally builds as **one** single-spa application
(`apps/country-explorer/src/main.single-spa.ts`, mounted under `/country-explorer`).
Run its bundle server so a single-spa shell can load it:

```bash
npm run serve:single-spa  # serves the ESM bundle at http://localhost:4201/main.js
```

The portfolio shell that composes this and other projects lives in a separate repo:
[**mfe-portfolio**](https://github.com/denis-coccodi/mfe-portfolio). It references
this bundle by URL via an import map — Country Explorer's source stays here.

### API key

Country Explorer needs a REST Countries v5 API key. Copy `apps/country-explorer/proxy.secrets.example.json` to `apps/country-explorer/proxy.secrets.json` and add your key (or set `REST_COUNTRIES_API_KEY`). When embedded, the shell's dev proxy injects the `Authorization` header server-side (Country Explorer runs in the shell's origin); standalone, this app's own `proxy.conf.js` does it.
