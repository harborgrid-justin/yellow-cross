/**
 * WF-COMP-XXX | ApiCache.ts - API response caching
 * Purpose: Cache API responses to improve performance
 * Last Updated: 2025-10-22 | File Type: .ts
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTtl = 5 * 60 * 1000; // 5 minutes

  /**
   * Set a cache entry
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTtl): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Get a cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Check if a key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const apiCache = new ApiCache();

// Periodically clear expired entries (every 5 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.clearExpired();
  }, 5 * 60 * 1000);
}
