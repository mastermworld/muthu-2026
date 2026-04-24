import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import logger from '../utils/logger';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LocationResponse {
  value: string;
  label: string;
  name: string;
  id?: string;
}

// ─── In-memory lookup maps (populated once on first use) ─────────────────────
type StrMap<T> = Record<string, T>;

let countries:        LocationResponse[]             | null = null;
let statesByCountry:  StrMap<LocationResponse[]>     | null = null;
let districtsByState: StrMap<LocationResponse[]>     | null = null;
let taluksByDistrict: StrMap<LocationResponse[]>     | null = null;
let villagesByTaluk:  StrMap<LocationResponse[]>     | null = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toSlug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-');
const toOpt  = (name: string): LocationResponse => ({
  value: toSlug(name),
  label: name.trim(),
  name:  name.trim(),
});

/**
 * Parse Location_T.csv (India-specific 5-level hierarchy) and merge in
 * all world countries + their states/provinces from country-region-data.
 */
function loadData(): void {
  if (countries !== null) return;

  const countrySet:   Set<string>       = new Set();
  const stateSets:    StrMap<Set<string>> = {};
  const districtSets: StrMap<Set<string>> = {};
  const talukSets:    StrMap<Set<string>> = {};
  const villageSets:  StrMap<Set<string>> = {};

  // ── 1. Load India CSV data (full 5-level hierarchy; supports quoted fields) ─
  const csvPath = path.join(__dirname, '..', 'data', 'Location_T.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
  }) as Array<Record<string, string>>;

  for (const row of records) {
    const country  = (row.Country || '').trim();
    const state    = (row.state || '').trim();
    const district = (row.district || '').trim();
    const taluka   = (row.taluka || '').trim();
    const village  = (row.village || '').trim();

    if (!country || !state || !district) continue;

    const cKey = toSlug(country);
    const sKey = toSlug(state);
    const dKey = toSlug(district);

    countrySet.add(country);

    if (!stateSets[cKey])    stateSets[cKey]    = new Set();
    stateSets[cKey].add(state);

    if (!districtSets[sKey]) districtSets[sKey] = new Set();
    districtSets[sKey].add(district);

    if (taluka) {
      if (!talukSets[dKey])    talukSets[dKey]    = new Set();
      talukSets[dKey].add(taluka);
    }

    if (village) {
      const tKey = toSlug(taluka);
      if (!villageSets[tKey])  villageSets[tKey]  = new Set();
      villageSets[tKey].add(village);
    }
  }

  // ── 2. Load world countries + states from country-region-data ───────────
  try {
    const countryRegionData: Array<{
      countryName: string;
      countryShortCode: string;
      regions: Array<{ name: string; shortCode?: string }>;
    }> = require('country-region-data/data.json');

    for (const entry of countryRegionData) {
      const name = entry.countryName;
      const cKey = toSlug(name);

      if (countrySet.has(name)) continue; // India already loaded from CSV

      countrySet.add(name);
      if (entry.regions.length > 0) {
        stateSets[cKey] = new Set(entry.regions.map(r => r.name));
      }
    }
  } catch (err) {
    logger.warn('country-region-data not available; only CSV countries will be used.');
  }

  // ── 3. Convert sets → sorted option arrays ─────────────────────────────
  countries        = [...countrySet].sort().map(toOpt);
  statesByCountry  = mapSetsToOptions(stateSets);
  districtsByState = mapSetsToOptions(districtSets);
  taluksByDistrict = mapSetsToOptions(talukSets);
  villagesByTaluk  = mapSetsToOptions(villageSets);

  logger.info(
    `Location data loaded: ${countries.length} countries, ` +
    `${Object.keys(statesByCountry).length} country→state entries, ` +
    `${Object.keys(districtsByState).length} state→district entries, ` +
    `${Object.keys(taluksByDistrict).length} district→taluk entries, ` +
    `${Object.keys(villagesByTaluk).length} taluk→village entries`
  );
}

function mapSetsToOptions(sets: StrMap<Set<string>>): StrMap<LocationResponse[]> {
  const result: StrMap<LocationResponse[]> = {};
  for (const [key, nameSet] of Object.entries(sets)) {
    result[key] = [...nameSet].sort().map(toOpt);
  }
  return result;
}

// ─── Public API (mirrors the old enhanced-location.service interface) ─────────

export const getCountries = async (): Promise<LocationResponse[]> => {
  loadData();
  return countries!;
};

export const getStatesByCountry = async (country: string): Promise<LocationResponse[]> => {
  loadData();
  return statesByCountry![toSlug(country)] || [];
};

export const getDistrictsByState = async (state: string): Promise<LocationResponse[]> => {
  loadData();
  return districtsByState![toSlug(state)] || [];
};

export const getTaluksByDistrict = async (district: string): Promise<LocationResponse[]> => {
  loadData();
  return taluksByDistrict![toSlug(district)] || [];
};

export const getVillagesByTaluk = async (taluk: string): Promise<LocationResponse[]> => {
  loadData();
  return villagesByTaluk![toSlug(taluk)] || [];
};

export const searchLocations = async (
  query: string,
  type: 'state' | 'district' | 'taluk' | 'village',
  limit: number = 20
): Promise<LocationResponse[]> => {
  loadData();
  const q = query.toLowerCase();

  let pool: LocationResponse[] = [];
  switch (type) {
    case 'state':
      pool = Object.values(statesByCountry!).flat();
      break;
    case 'district':
      pool = Object.values(districtsByState!).flat();
      break;
    case 'taluk':
      pool = Object.values(taluksByDistrict!).flat();
      break;
    case 'village':
      pool = Object.values(villagesByTaluk!).flat();
      break;
  }

  return pool
    .filter(o => o.name.toLowerCase().includes(q))
    .slice(0, limit);
};

export const getLocationHierarchy = async (
  country?: string,
  state?: string,
  district?: string,
  taluk?: string
) => {
  loadData();
  const result: Record<string, LocationResponse[]> = {
    countries: countries!,
  };
  if (country) {
    result.states = await getStatesByCountry(country);
    if (state) {
      result.districts = await getDistrictsByState(state);
      if (district) {
        result.taluks = await getTaluksByDistrict(district);
        if (taluk) {
          result.villages = await getVillagesByTaluk(taluk);
        }
      }
    }
  }
  return result;
};

export const useDatabase = false;
