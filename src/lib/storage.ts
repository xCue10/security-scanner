import fs from 'fs';
import path from 'path';

// Use /app-data for production (Railway volume), fall back to local .data for dev
const DATA_DIR = process.env.DATA_DIR || (process.env.NODE_ENV === 'production' ? '/app-data' : path.join(process.cwd(), '.data'));

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const ASSETS_FILE = path.join(DATA_DIR, 'assets.json');

// Helper to read JSON safely
const readJson = (file: string) => {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
};

// Helper to write JSON safely
const writeJson = (file: string, data: any) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

export const storage = {
  // SCAN RECORDS
  getRecords: () => readJson(RECORDS_FILE),
  addRecord: (record: any) => {
    const records = readJson(RECORDS_FILE);
    const newRecord = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      ...record
    };
    records.unshift(newRecord);
    writeJson(RECORDS_FILE, records.slice(0, 500)); // Keep last 500
    return newRecord;
  },

  // DISCOVERED ASSETS
  getAssets: () => readJson(ASSETS_FILE),
  upsertAsset: (assetData: { domain: string, source: string }) => {
    const assets = readJson(ASSETS_FILE);
    const index = assets.findIndex((a: any) => a.domain === assetData.domain);
    
    const now = new Date().toISOString();
    if (index > -1) {
      assets[index].lastSeen = now;
    } else {
      assets.push({
        id: Math.random().toString(36).substring(2, 15),
        domain: assetData.domain,
        source: assetData.source,
        createdAt: now,
        lastSeen: now
      });
    }
    writeJson(ASSETS_FILE, assets);
  }
};
