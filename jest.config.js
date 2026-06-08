/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '^@country-explorer/compare-countries$': '<rootDir>/libs/compare-countries/src/index.ts',
    '^@country-explorer/countries$': '<rootDir>/libs/countries/src/index.ts',
    '^@country-explorer/ui-kit$': '<rootDir>/libs/ui-kit/src/index.ts',
    '^@country-explorer/rest-countries-api$': '<rootDir>/libs/rest-countries-api/src/index.ts',
    '^@country-explorer/types/backend$': '<rootDir>/libs/types/src/backend/index.ts',
    '^@country-explorer/types/frontend$': '<rootDir>/libs/types/src/frontend/index.ts',
    '^@app/(.*)$': '<rootDir>/apps/country-explorer/src/app/$1',
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
};
