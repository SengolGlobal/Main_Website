import 'server-only';

/**
 * Small in-memory sliding-window limiter. It protects a single server instance;
 * on multi-instance or serverless hosting, add a shared store (e.g. Upstash Redis)
 * or the host's firewall rules for stronger guarantees.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return true;
}
