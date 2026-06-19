import { mapV5CountryToFullCountry, mapV5Response } from './country.mapper';
import { V5Country } from './v5-response.model';

const germany: V5Country = {
  names: {
    common: 'Germany',
    official: 'Federal Republic of Germany',
    alternates: ['Deutschland'],
    native: { deu: { common: 'Deutschland', official: 'Bundesrepublik Deutschland' } },
  },
  codes: { alpha_2: 'DE', alpha_3: 'DEU', ccn3: '276', cioc: 'GER', fifa: 'GER' },
  capitals: [{ name: 'Berlin', coordinates: { lat: 52.52, lng: 13.4 } }],
  flag: {
    url_png: 'https://flags/de.png',
    url_svg: 'https://flags/de.svg',
    description: 'Black, red and gold',
    emoji: '🇩🇪',
  },
  region: 'Europe',
  subregion: 'Western Europe',
  area: { kilometers: 357114, miles: 137882 },
  borders: ['FRA', 'POL'],
  calling_codes: ['49'],
  cars: { driving_side: 'right', signs: ['D'] },
  classification: { iso_status: 'official', sovereign: true, un_member: true },
  continents: ['Europe'],
  coordinates: { lat: 51, lng: 9 },
  currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
  date: { start_of_week: 'monday' },
  landlocked: false,
  languages: [{ iso639_3: 'deu', bcp47: 'de', name: 'German' }],
  links: { google_maps: 'https://maps', open_street_maps: 'https://osm' },
  population: 83000000,
  timezones: ['UTC+01:00'],
  tlds: ['.de'],
};

describe('mapV5CountryToFullCountry', () => {
  it('maps nested v5 fields into the internal FullCountry shape', () => {
    const country = mapV5CountryToFullCountry(germany);

    expect(country.name.common).toBe('Germany');
    expect(country.name.official).toBe('Federal Republic of Germany');
    expect(country.cca3).toBe('DEU');
    expect(country.capital).toEqual(['Berlin']);
    expect(country.flags.png).toBe('https://flags/de.png');
    expect(country.area).toBe(357114);
    expect(country.region).toBe('Europe');
    expect(country.borders).toEqual(['FRA', 'POL']);
    expect(country.timezones).toEqual(['UTC+01:00']);
  });

  it('reshapes currency and language arrays into keyed records', () => {
    const country = mapV5CountryToFullCountry(germany);

    expect(country.currencies).toEqual({ EUR: { name: 'Euro', symbol: '€' } });
    expect(country.languages).toEqual({ deu: 'German' });
  });

  it('falls back to safe defaults for missing fields', () => {
    const country = mapV5CountryToFullCountry({});

    expect(country.name.common).toBe('');
    expect(country.cca3).toBe('');
    expect(country.capital).toEqual([]);
    expect(country.currencies).toEqual({});
    expect(country.area).toBe(0);
    expect(country.flags.png).toBe('');
  });
});

describe('mapV5Response', () => {
  it('unwraps the data.objects envelope and maps each entry', () => {
    const mapped = mapV5Response({
      data: {
        objects: [germany, {}],
        meta: { total: 2, count: 2, limit: 25, offset: 0, more: false },
      },
    });

    expect(mapped).toHaveLength(2);
    expect(mapped[0].name.common).toBe('Germany');
  });

  it('tolerates a missing envelope', () => {
    expect(mapV5Response(undefined as never)).toEqual([]);
  });
});
