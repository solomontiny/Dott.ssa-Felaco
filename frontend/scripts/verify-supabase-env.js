/*
 * CRA embeds REACT_APP_* values into the JavaScript bundle at build time.
 * Validate the values before starting or building so a static deployment can
 * never ship a bundle that initializes Supabase with empty credentials.
 */
const fs = require('fs');
const path = require('path');

const requiredVariables = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY',
];

function loadDotEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || Object.prototype.hasOwnProperty.call(process.env, match[1])) continue;

    const value = match[2].replace(/^(['"])(.*)\1$/, '$2').trim();
    process.env[match[1]] = value;
  }
}

const environment = process.argv[2] || process.env.NODE_ENV || 'development';
[
  `.env.${environment}.local`,
  ...(environment === 'test' ? [] : ['.env.local']),
  `.env.${environment}`,
  '.env',
].forEach(loadDotEnvFile);

const missingVariables = requiredVariables.filter((name) => !process.env[name]?.trim());

if (missingVariables.length > 0) {
  console.error(
    `Missing required Supabase build variable(s): ${missingVariables.join(', ')}.\n` +
      'Set them in frontend/.env for local development, or in the Cloudflare build environment before running the build.'
  );
  process.exit(1);
}
