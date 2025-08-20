// Server-side only cache utilities
let fs, path;

if (typeof window === 'undefined') {
  fs = require('fs');
  path = require('path');
}

const DEV_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in development
const PROD_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in production

let CACHE_DIR;

// Ensure cache directory exists (server-side only)
if (typeof window === 'undefined' && path) {
  CACHE_DIR = path.join(process.cwd(), '.cache');
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export class DataCache {
  static getCachePath(key) {
    if (typeof window !== 'undefined' || !path) return null;
    return path.join(CACHE_DIR, `${key}.json`);
  }

  static isValidCache(filePath, duration) {
    if (typeof window !== 'undefined' || !fs || !filePath) return false;
    if (!fs.existsSync(filePath)) return false;
    
    const stats = fs.statSync(filePath);
    const age = Date.now() - stats.mtime.getTime();
    return age < duration;
  }

  static get(key) {
    if (typeof window !== 'undefined' || !fs || !path) return null; // Only cache on server
    
    try {
      const filePath = this.getCachePath(key);
      if (!filePath) return null;
      
      const duration = process.env.NODE_ENV === 'development' 
        ? DEV_CACHE_DURATION 
        : PROD_CACHE_DURATION;

      if (this.isValidCache(filePath, duration)) {
        const data = fs.readFileSync(filePath, 'utf8');
        console.log(`Cache HIT for ${key}`);
        return JSON.parse(data);
      }
      
      console.log(`Cache MISS for ${key}`);
      return null;
    } catch (error) {
      console.error(`Cache read error for ${key}:`, error);
      return null;
    }
  }

  static set(key, data) {
    if (typeof window !== 'undefined' || !fs || !path) return; // Only cache on server
    
    try {
      const filePath = this.getCachePath(key);
      if (!filePath) return;
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Cache SET for ${key}`);
    } catch (error) {
      console.error(`Cache write error for ${key}:`, error);
    }
  }

  static clear(key = null) {
    if (typeof window !== 'undefined' || !fs || !path) return;
    
    try {
      if (key) {
        const filePath = this.getCachePath(key);
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Cache cleared for ${key}`);
        }
      } else {
        // Clear all cache files
        if (CACHE_DIR && fs.existsSync(CACHE_DIR)) {
          const files = fs.readdirSync(CACHE_DIR);
          files.forEach(file => {
            fs.unlinkSync(path.join(CACHE_DIR, file));
          });
          console.log('All cache cleared');
        }
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

// Memory cache for same request deduplication
const requestCache = new Map();

export function withCache(key, fetchFn) {
  return async (...args) => {
    // Only use caching on server side
    if (typeof window !== 'undefined') {
      return fetchFn(...args);
    }

    // Check file cache first
    const cached = DataCache.get(key);
    if (cached) {
      return cached;
    }

    // Check if same request is already in flight
    if (requestCache.has(key)) {
      console.log(`Request deduplication for ${key}`);
      return requestCache.get(key);
    }

    // Create new request and cache the promise
    const promise = fetchFn(...args);
    requestCache.set(key, promise);

    try {
      const result = await promise;
      DataCache.set(key, result);
      requestCache.delete(key);
      return result;
    } catch (error) {
      requestCache.delete(key);
      throw error;
    }
  };
}