import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 1800, checkperiod: 120 });

const normalizeKey = (key: string): string => key.trim().toLowerCase();

export const cacheUtil = {
  get<T>(key: string): T | undefined {
    return cache.get<T>(normalizeKey(key));
  },
  set<T>(key: string, value: T, ttlSeconds?: number): boolean {
    if (ttlSeconds) {
      return cache.set(normalizeKey(key), value, ttlSeconds);
    }
    return cache.set(normalizeKey(key), value);
  }
};