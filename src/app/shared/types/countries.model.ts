export interface CountryFlags {
  png: string;
  svg: string;
  alt: string;
}

export interface CountryName {
  common: string;
  official: string;
  nativeName: Record<string, NativeName>;
}

export interface NativeName {
  official: string;
  common: string;
}

export interface Currency {
  name: string;
  symbol: string;
}

export interface CountryMaps {
  googleMaps: string;
  openStreetMaps: string;
}

export interface CountryIdd {
  root: string;
  suffixes: string[];
}

export interface CountryCar {
  signs: string[];
  side: string;
}

export interface CountryDemonym {
  f: string;
  m: string;
}

export interface CountryCoatOfArms {
  png: string;
  svg: string;
}

export interface CountryCapitalInfo {
  latlng: [number, number];
}

export interface CountryPostalCode {
  format: string | null;
  regex: string | null;
}

export interface Country {
  flags: CountryFlags;
  name: CountryName;
  currencies: Record<string, Currency>;
  languages: Record<string, string>;
  cca3: string;
  capital: string[];
  region: string;
  borders: string[];
  area: number;
  population: number;
}

export interface FullCountry extends Country {
  tld: string[];
  cca2: string;
  ccn3: string;
  cioc: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  idd: CountryIdd;
  altSpellings: string[];
  timezones: string[];
  subregion: string;
  landlocked: boolean;
  maps: CountryMaps;
  fifa: string;
  car: CountryCar;
  continents: string[];
  flag: string;
  latlng: [number, number];
  demonyms: Record<string, CountryDemonym>;
  translations: Record<string, NativeName>;
  coatOfArms: CountryCoatOfArms;
  startOfWeek: string;
  capitalInfo: CountryCapitalInfo;
  postalCode: CountryPostalCode;
}

export function isFullCountry(
  country: Country | FullCountry,
): country is FullCountry {
  return 'timezones' in country;
}

export type countryCardPropertyDetail = {
  value: string;
  label: string;
};
