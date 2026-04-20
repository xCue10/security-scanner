import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || './data';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readData<T>(name: string): T[] {
  ensureDir(DATA_DIR);
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return [];
  try {
    const raw = fs.readFileSync(fp, 'utf-8');
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function writeData<T>(name: string, data: T[]): void {
  ensureDir(DATA_DIR);
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf-8');
}

export function appendData<T extends Record<string, unknown>>(name: string, record: T): T {
  const existing = readData<T>(name);
  existing.unshift(record);
  writeData(name, existing);
  return record;
}

export function upsertByField<T extends Record<string, unknown>>(
  name: string,
  field: keyof T,
  value: unknown,
  record: T
): T {
  const existing = readData<T>(name);
  const idx = existing.findIndex(item => item[field] === value);
  if (idx >= 0) {
    existing[idx] = { ...existing[idx], ...record };
  } else {
    existing.unshift(record);
  }
  writeData(name, existing);
  return idx >= 0 ? existing[idx] : record;
}
