interface RateLimitStore {
  [key: string]: {
    attempts: number;
    lastAttempt: number;
    blockedUntil: number;
  };
}

const store: RateLimitStore = {};

const LIMIT = 5; // Max attempts
const COOLDOWN = 15 * 60 * 1000; // 15 minutes in ms

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; blockedUntil?: number } {
  const now = Date.now();
  const record = store[ip];

  if (!record) {
    store[ip] = { attempts: 0, lastAttempt: now, blockedUntil: 0 };
    return { allowed: true, remaining: LIMIT };
  }

  if (record.blockedUntil > now) {
    return { allowed: false, remaining: 0, blockedUntil: record.blockedUntil };
  }

  // Reset if last attempt was a long time ago
  if (now - record.lastAttempt > COOLDOWN) {
    record.attempts = 0;
  }

  return { 
    allowed: record.attempts < LIMIT, 
    remaining: Math.max(0, LIMIT - record.attempts) 
  };
}

export function recordFailure(ip: string) {
  const record = store[ip];
  if (record) {
    record.attempts += 1;
    record.lastAttempt = Date.now();
    if (record.attempts >= LIMIT) {
      record.blockedUntil = Date.now() + COOLDOWN;
    }
  }
}

export function resetLimit(ip: string) {
  delete store[ip];
}
