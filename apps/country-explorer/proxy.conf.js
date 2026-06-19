// Dev-server proxy for the REST Countries v5 API.
//
// The API key is kept OUT of source control. It is resolved from, in order:
//   1. the REST_COUNTRIES_API_KEY environment variable, or
//   2. the gitignored apps/country-explorer/proxy.secrets.json file
//      (copy proxy.secrets.example.json and add your key).
//
// The key is injected as an Authorization header server-side, so it never ships
// in the browser bundle.
const fs = require('fs');
const path = require('path');

function resolveApiKey() {
  if (process.env.REST_COUNTRIES_API_KEY) {
    return process.env.REST_COUNTRIES_API_KEY;
  }

  try {
    const secretsPath = path.join(__dirname, 'proxy.secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    return secrets.apiKey;
  } catch {
    return undefined;
  }
}

const apiKey = resolveApiKey();

if (!apiKey) {
  console.warn(
    '[proxy] No REST Countries API key found. Set REST_COUNTRIES_API_KEY or ' +
      'create apps/country-explorer/proxy.secrets.json (see proxy.secrets.example.json). ' +
      'Requests to the countries API will fail with 401 until a key is provided.',
  );
}

module.exports = {
  '/countries/v5': {
    target: 'https://api.restcountries.com',
    secure: true,
    changeOrigin: true,
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
  },
};
