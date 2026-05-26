import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2] ?? 'all';
const cwd = process.cwd();

function readEnvFile(filename) {
  const fullPath = path.join(cwd, filename);
  if (!fs.existsSync(fullPath)) {
    return {};
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const entries = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    entries[key] = value;
  }

  return entries;
}

const fileEnv = {
  ...readEnvFile('.env'),
  ...readEnvFile('.dev.vars'),
};
const mergedEnv = {
  ...fileEnv,
  ...process.env,
};

function getValue(key) {
  const value = mergedEnv[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function validateRequired(keys, label) {
  const missing = keys.filter((key) => !getValue(key));
  if (missing.length > 0) {
    console.error(`\n${label} is missing required values:`);
    for (const key of missing) {
      console.error(`- ${key}`);
    }
    return false;
  }

  console.log(`\n${label} is configured.`);
  return true;
}

let ok = true;

if (mode === 'all' || mode === 'worker') {
  ok =
    validateRequired(
      [
        'ADMIN_EMAIL',
        'ADMIN_PASSWORD_HASH',
        'SESSION_SECRET',
        'PUBLIC_APP_ORIGIN',
      ],
      'Worker runtime',
    ) && ok;
}

if (mode === 'all' || mode === 'appwrite') {
  const appwriteKeys = [
    'VITE_APPWRITE_ENDPOINT',
    'VITE_APPWRITE_PROJECT_ID',
    'VITE_APPWRITE_DATABASE_ID',
    'VITE_APPWRITE_ENQUIRIES_COLLECTION_ID',
    'VITE_APPWRITE_USERS_COLLECTION_ID',
    'VITE_APPWRITE_STORAGE_BUCKET_ID',
    'VITE_APPWRITE_ADMIN_TEAM_ID',
  ];
  const anyConfigured = appwriteKeys.some((key) => Boolean(getValue(key)));

  if (!anyConfigured) {
    console.warn('\nAppwrite scaffold is not configured yet. This is expected if the repo is still running on Worker + D1 only.');
  } else {
    ok = validateRequired(appwriteKeys, 'Appwrite runtime') && ok;
  }
}

console.log('\nOptional white-label variables:');
for (const key of [
  'VITE_BRAND_NAME',
  'VITE_BRAND_INITIALS',
  'VITE_PRODUCT_NAME',
  'VITE_PRODUCT_LABEL',
  'VITE_PRODUCT_TAGLINE',
  'VITE_PRODUCT_DESCRIPTION',
  'VITE_SUPPORT_EMAIL',
  'VITE_APPWRITE_WHITE_LABEL_COLLECTION_ID',
]) {
  console.log(`- ${key}: ${getValue(key) ? 'set' : 'using fallback/default'}`);
}

if (!ok) {
  process.exitCode = 1;
}
