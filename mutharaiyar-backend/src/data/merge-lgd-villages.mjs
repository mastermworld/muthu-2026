/**
 * Merges LGD 4-village.csv into Location_T.csv:
 * - Keeps header + Tamil Nadu block (village-level, existing file)
 * - Drops sub-district-only rows that were added earlier (line 17655+ in old file)
 * - Appends all villages for non–Tamil Nadu states from 4-village.csv
 *
 * Run from backend:  node src/data/merge-lgd-villages.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const toTitleCase = (s) => {
  if (!s) return '';
  return String(s)
    .trim()
    .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
};

const csvEscape = (s) => {
  s = String(s);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const dataDir = __dirname;
const oldPath = path.join(dataDir, 'Location_T.csv');
const outPath = path.join(dataDir, 'Location_T_new.csv');
const villagePath = path.join(dataDir, 'lgd-village-temp', '4-village.csv');

const TAMIL_NADU = 'TAMIL NADU';
const TN_PREFIX_LINES = 17654; // line 1 = header, 2–17654 = TN village rows (17653)

const raw = fs.readFileSync(oldPath, 'utf-8');
const allLines = raw.split(/\r?\n/);
const head = allLines.slice(0, TN_PREFIX_LINES).join('\n') + '\n';
fs.writeFileSync(outPath, head, 'utf-8');

const out = fs.createWriteStream(outPath, { flags: 'a' });
let count = 0;
let paused = false;

const stream = fs.createReadStream(villagePath).pipe(csv());

stream.on('data', (row) => {
  if (row['State Name (In English)'] === TAMIL_NADU) return;
  const vill = (row['Village Name (In Englsih)'] || '').trim();
  if (!vill) return;

  const state = toTitleCase(row['State Name (In English)']);
  const district = toTitleCase(row['District Name (In English)']);
  const sub = toTitleCase(row['Subdistrict Name (In English)']);
  const villT = toTitleCase(vill);
  const line = ['India', state, district, sub, villT].map(csvEscape).join(',') + '\n';

  if (!out.write(line)) {
    stream.pause();
    out.once('drain', () => {
      stream.resume();
    });
  }
  count++;
});

stream.on('end', () => {
  out.end();
});

out.on('finish', () => {
  const backup = path.join(dataDir, 'Location_T_before_villages_backup.csv');
  fs.copyFileSync(oldPath, backup);
  fs.copyFileSync(outPath, oldPath);
  fs.unlinkSync(outPath);
  console.log(`OK: ${count} non–Tamil Nadu village rows merged into Location_T.csv`);
  console.log(`Backup: ${backup}`);
});

stream.on('error', (e) => {
  console.error(e);
  process.exit(1);
});

out.on('error', (e) => {
  console.error(e);
  process.exit(1);
});
