export interface IntegrityResult {
  fileName: string;
  fileSize: number;
  detectedType: string;
  magicBytes: string;
  sha256: string;
  match: boolean; // Does the extension match the magic bytes?
}

const MAGIC_BYTES: { [key: string]: { mime: string, ext: string } } = {
  '47494638': { mime: 'image/gif', ext: 'gif' },
  '89504e47': { mime: 'image/png', ext: 'png' },
  'ffd8ffe0': { mime: 'image/jpeg', ext: 'jpg' },
  'ffd8ffe1': { mime: 'image/jpeg', ext: 'jpg' },
  '25504446': { mime: 'application/pdf', ext: 'pdf' },
  '504b0304': { mime: 'application/zip', ext: 'zip' }, // Also Office docs
  '4d5a': { mime: 'application/x-msdownload', ext: 'exe' },
  '7b0a': { mime: 'application/json', ext: 'json' },
  'efbbbf': { mime: 'text/plain', ext: 'txt' } // UTF-8 BOM
};

export async function analyzeFileIntegrity(file: File): Promise<IntegrityResult> {
  // 1. Read Magic Bytes
  const headerBuffer = await file.slice(0, 4).arrayBuffer();
  const headerArray = new Uint8Array(headerBuffer);
  const magicBytes = Array.from(headerArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  let detectedType = 'Unknown / Plain Text';
  let match = true;

  for (const [key, value] of Object.entries(MAGIC_BYTES)) {
    if (magicBytes.startsWith(key)) {
      detectedType = value.mime;
      match = file.name.toLowerCase().endsWith(value.ext);
      break;
    }
  }

  // 2. Generate SHA-256 Hash
  const fileBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    fileName: file.name,
    fileSize: file.size,
    detectedType,
    magicBytes: magicBytes.toUpperCase(),
    sha256,
    match
  };
}
