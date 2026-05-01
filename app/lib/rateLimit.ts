// ─── In-Memory Rate Limiter ─────────────────────────────────────────────────

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const attempts = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of attempts.entries()) {
    if (now - entry.firstAttempt > WINDOW_MS) {
      attempts.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if a given IP has exceeded the rate limit.
 * Returns { limited: false } if under the limit, or
 * { limited: true, retryAfterMs } if over the limit.
 */
export function checkRateLimit(ip: string): {
  limited: boolean;
  retryAfterMs?: number;
} {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry) {
    // First attempt
    attempts.set(ip, { count: 1, firstAttempt: now });
    return { limited: false };
  }

  // Window expired — reset
  if (now - entry.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now });
    return { limited: false };
  }

  // Within window
  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.firstAttempt);
    return { limited: true, retryAfterMs };
  }

  entry.count++;
  return { limited: false };
}

/**
 * Reset rate limit for a given IP (e.g., after successful login).
 */
export function resetRateLimit(ip: string): void {
  attempts.delete(ip);
}
