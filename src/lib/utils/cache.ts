import { browser } from "$app/environment";
import { error } from "@sveltejs/kit";

/**
 * Interface representing a cached item with its data and timestamp
 * @template T The type of data being cached
 */
interface CacheItem<T> {
    data: T;
    timestamp: number;
}

/**
 * A generic request caching system that works in browser environments
 * Provides automatic cache invalidation and size management
 */
export class RequestCache {
    private cache = new Map<string, CacheItem<any>>();
    private maxAge: number;
    private maxSize: number;

    /**
     * Creates a new RequestCache instance
     * @param maxAge Maximum age of cache entries in milliseconds (default: 5 minutes)
     * @param maxSize Maximum number of items to keep in cache (default: 100)
     */
    constructor(maxAge = 5 * 60 * 1000, maxSize = 100) {
        this.maxAge = maxAge;
        this.maxSize = maxSize;
    }

    /**
     * Fetches data from cache if available and valid, otherwise makes a fetch request
     * @template T The type of response data
     * @param input The request URL or Request object
     * @param init Optional fetch init options
     * @returns Promise resolving to the fetched data
     * @throws {Error} If the fetch request fails
     */
    async fetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
        // Convert various input types to a cache key string
        const key = typeof input === 'string' ? input :
                   input instanceof URL ? input.toString() :
                   input instanceof Request ? input.url :
                   String(input); // Handle any remaining cases safely

        if (browser) {
            const cached = this.cache.get(key);
            if (cached && Date.now() - cached.timestamp < this.maxAge) {
                return cached.data as T;
            }
        }

        const response = await fetch(input, init);

        if (!response.ok) {
            try {
                const message = await response.json();
                throw error(response.status, message);
            } catch {
                throw error(response.status, "Request failed");
            }
        }

        const result = await response.json();

        if (browser) {
            if (this.cache.size >= this.maxSize) {
                const oldestKey = this.cache.keys().next().value;
                if (oldestKey !== undefined) {
                    this.cache.delete(oldestKey);
                }
            }
            
            this.cache.set(key, {
                data: result,
                timestamp: Date.now()
            });
        }

        return result as T;
    }

    /**
     * Clears all entries from the cache
     */
    clear(): void {
        this.cache.clear();
    }
}

export const defaultCache = new RequestCache();