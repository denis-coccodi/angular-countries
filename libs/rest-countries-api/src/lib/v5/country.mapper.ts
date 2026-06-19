import {
  Currency,
  FullCountry,
  NativeName,
} from '@country-explorer/types/backend';
import { V5Country, V5NativeName, V5Response } from './v5-response.model';

/**
 * Translates a REST Countries **v5** country object into the internal
 * {@link FullCountry} shape the app consumes (which mirrors the legacy
 * v1–v4 structure). Mapping is defensive: any missing v5 field falls back to a
 * sensible empty default so the UI never crashes on partial data.
 */
export function mapV5CountryToFullCountry(v5: V5Country): FullCountry {
  return {
    // --- Country (base) ---
    flags: {
      png: v5.flag?.url_png ?? '',
      svg: v5.flag?.url_svg ?? '',
      alt: v5.flag?.description ?? '',
    },
    name: {
      common: v5.names?.common ?? '',
      official: v5.names?.official ?? '',
      nativeName: mapNativeNames(v5.names?.native),
    },
    currencies: mapCurrencies(v5.currencies),
    languages: mapLanguages(v5.languages),
    cca3: v5.codes?.alpha_3 ?? '',
    capital: (v5.capitals ?? [])
      .map((capital) => capital.name)
      .filter((name): name is string => !!name),
    region: v5.region ?? '',
    borders: v5.borders ?? [],
    area: v5.area?.kilometers ?? 0,
    population: v5.population ?? 0,

    // --- FullCountry (extended) ---
    tld: v5.tlds ?? [],
    cca2: v5.codes?.alpha_2 ?? '',
    ccn3: v5.codes?.ccn3 ?? '',
    cioc: v5.codes?.cioc ?? '',
    independent: v5.classification?.sovereign ?? false,
    status: v5.classification?.iso_status ?? '',
    unMember: v5.classification?.un_member ?? false,
    idd: {
      root: v5.calling_codes?.length ? '+' : '',
      suffixes: v5.calling_codes ?? [],
    },
    altSpellings: v5.names?.alternates ?? [],
    timezones: v5.timezones ?? [],
    subregion: v5.subregion ?? '',
    landlocked: v5.landlocked ?? false,
    maps: {
      googleMaps: v5.links?.google_maps ?? '',
      openStreetMaps: v5.links?.open_street_maps ?? '',
    },
    fifa: v5.codes?.fifa ?? '',
    car: {
      signs: v5.cars?.signs ?? [],
      side: v5.cars?.driving_side ?? '',
    },
    continents: v5.continents ?? [],
    flag: v5.flag?.emoji ?? '',
    latlng: [v5.coordinates?.lat ?? 0, v5.coordinates?.lng ?? 0],
    demonyms: mapDemonyms(v5.demonyms),
    translations: mapNativeNames(v5.names?.translations),
    // Not exposed by v5 — kept for shape compatibility.
    coatOfArms: { png: '', svg: '' },
    startOfWeek: v5.date?.start_of_week ?? '',
    capitalInfo: {
      latlng: [
        v5.capitals?.[0]?.coordinates?.lat ?? 0,
        v5.capitals?.[0]?.coordinates?.lng ?? 0,
      ],
    },
    postalCode: {
      format: v5.postal_code?.format ?? null,
      regex: v5.postal_code?.regex ?? null,
    },
  };
}

/**
 * Unwraps a v5 `{ data: { objects } }` envelope into an array of internal
 * countries. The 1:1 object count is preserved (no filtering) so callers that
 * rely on page size for pagination stay accurate; dropping codeless entries is
 * left to the caller (see `AllService`).
 */
export function mapV5Response(response: V5Response): FullCountry[] {
  return (response?.data?.objects ?? []).map(mapV5CountryToFullCountry);
}

function mapNativeNames(
  native: Record<string, V5NativeName> | undefined,
): Record<string, NativeName> {
  const result: Record<string, NativeName> = {};
  for (const [lang, value] of Object.entries(native ?? {})) {
    result[lang] = {
      common: value?.common ?? '',
      official: value?.official ?? '',
    };
  }
  return result;
}

function mapCurrencies(
  currencies: V5Country['currencies'],
): Record<string, Currency> {
  const result: Record<string, Currency> = {};
  for (const currency of currencies ?? []) {
    if (!currency?.code) continue;
    result[currency.code] = {
      name: currency.name ?? '',
      symbol: currency.symbol ?? '',
    };
  }
  return result;
}

function mapLanguages(
  languages: V5Country['languages'],
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const language of languages ?? []) {
    const key = language?.iso639_3 || language?.bcp47;
    if (!key || !language?.name) continue;
    result[key] = language.name;
  }
  return result;
}

function mapDemonyms(
  demonyms: V5Country['demonyms'],
): FullCountry['demonyms'] {
  const result: FullCountry['demonyms'] = {};
  for (const [lang, value] of Object.entries(demonyms ?? {})) {
    result[lang] = { f: value?.f ?? '', m: value?.m ?? '' };
  }
  return result;
}
