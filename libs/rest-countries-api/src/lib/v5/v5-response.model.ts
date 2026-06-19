/**
 * Minimal typings for the REST Countries **v5** API response.
 *
 * v5 wraps results in `{ data: { objects, meta } }` and uses a nested shape that
 * differs from the v1–v4 (a.k.a. v3.1) structure the rest of this app consumes.
 * These types cover only the fields we read; everything else is ignored.
 */

export interface V5Response {
  data: {
    objects: V5Country[];
    meta: V5Meta;
  };
}

export interface V5Meta {
  total: number;
  count: number;
  limit: number;
  offset: number;
  more: boolean;
}

export interface V5NativeName {
  common: string;
  official: string;
}

export interface V5Country {
  names?: {
    common?: string;
    official?: string;
    alternates?: string[];
    native?: Record<string, V5NativeName>;
    translations?: Record<string, V5NativeName>;
  };
  codes?: {
    alpha_2?: string;
    alpha_3?: string;
    ccn3?: string;
    cioc?: string;
    fifa?: string;
  };
  capitals?: Array<{
    name?: string;
    coordinates?: { lat?: number; lng?: number };
  }>;
  flag?: {
    url_png?: string;
    url_svg?: string;
    description?: string;
    emoji?: string;
  };
  region?: string;
  subregion?: string;
  area?: { kilometers?: number; miles?: number };
  borders?: string[];
  calling_codes?: string[];
  cars?: { driving_side?: string; signs?: string[] };
  classification?: {
    iso_status?: string;
    sovereign?: boolean;
    un_member?: boolean;
  };
  continents?: string[];
  coordinates?: { lat?: number; lng?: number };
  currencies?: Array<{ code?: string; name?: string; symbol?: string }>;
  date?: { start_of_week?: string };
  demonyms?: Record<string, { f?: string; m?: string }>;
  landlocked?: boolean;
  languages?: Array<{ iso639_3?: string; bcp47?: string; name?: string }>;
  links?: {
    google_maps?: string;
    open_street_maps?: string;
  };
  population?: number;
  postal_code?: { format?: string | null; regex?: string | null };
  timezones?: string[];
  tlds?: string[];
}
