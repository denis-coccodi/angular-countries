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
