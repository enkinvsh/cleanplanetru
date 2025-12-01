import { LRUCache } from 'lru-cache';

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimit = new LRUCache<string, RateLimitEntry>({
    max: 500,
    ttl: 60000, // 1 minute
});

export function checkRateLimit(
    identifier: string,
    limit: number = 5,
    windowMs: number = 60000
): boolean {
    const now = Date.now();
    const entry = rateLimit.get(identifier);

    // If no entry or window expired, create new
    if (!entry || now > entry.resetTime) {
        rateLimit.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
        });
        return true;
    }

    // Check if limit exceeded
    if (entry.count >= limit) {
        return false;
    }

    // Increment counter
    entry.count++;
    rateLimit.set(identifier, entry);
    return true;
}

export function getRateLimitInfo(identifier: string): {
    remaining: number;
    resetTime: number;
} | null {
    const entry = rateLimit.get(identifier);
    if (!entry) {
        return null;
    }

    return {
        remaining: Math.max(0, 5 - entry.count),
        resetTime: entry.resetTime,
    };
}
