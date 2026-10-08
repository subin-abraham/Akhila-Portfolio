import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvFile(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const eq = trimmed.indexOf('=');
      if (eq <= 0) {
        continue;
      }

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    return;
  }
}

loadEnvFile(resolve(process.cwd(), '.env'));
loadEnvFile(resolve(process.cwd(), '.env.local'));

const migrationPath = resolve(
  process.cwd(),
  'supabase/migrations/20260318120000_site_settings_theme.sql',
);
const migrationSql = readFileSync(migrationPath, 'utf8');

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (dbUrl) {
  const pg = await import('pg').catch(() => null);
  if (!pg) {
    console.error('Install pg to apply SQL via DATABASE_URL: npm i -D pg');
    process.exit(1);
  }

  const client = new pg.default.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(migrationSql);
    console.log('Applied theme migration via DATABASE_URL.');
  } finally {
    await client.end();
  }
}

const url = process.env.NEXT_SUPABASE_URL;
const key = process.env.NEXT_SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error('Missing NEXT_SUPABASE_URL or NEXT_SUPABASE_SECRET_KEY');
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const probe = await admin.from('site_settings').select('*').limit(1).single();

if (probe.error) {
  console.error('Failed to read site_settings:', probe.error.message);
  process.exit(1);
}

const row = probe.data;
const hasToggle = Object.prototype.hasOwnProperty.call(row, 'theme_toggle_enabled');
const hasDefault = Object.prototype.hasOwnProperty.call(row, 'default_theme');

if (!hasToggle || !hasDefault) {
  console.error('Theme columns are still missing on public.site_settings.');
  console.error('Run this SQL in the Supabase SQL editor, then re-run this script:\n');
  console.error(migrationSql);
  process.exit(2);
}

const { error } = await admin
  .from('site_settings')
  .update({
    theme_toggle_enabled: row.theme_toggle_enabled ?? true,
    default_theme: row.default_theme ?? 'dark',
    updated_at: new Date().toISOString(),
  })
  .eq('id', row.id);

if (error) {
  console.error('Failed to confirm theme settings:', error.message);
  process.exit(1);
}

console.log('Theme settings ready:', {
  id: row.id,
  theme_toggle_enabled: row.theme_toggle_enabled ?? true,
  default_theme: row.default_theme ?? 'dark',
});
