import _ from 'lodash';
import LRU from 'lru-cache';
import { SRecord } from '../../../types/helpers.type';

type TGetManyData<T> = (keys: string[]) => Promise<SRecord<T>>;
type TGetOneData<T> = (key: string) => Promise<T>;

export class CacheManager {
  cacheRecord: SRecord<LRU<unknown, unknown> | undefined> = {};

  constructor(private cacheOptions: LRU.Options<unknown, unknown>) {}

  getCache(cacheKey: string): LRU<unknown, unknown> {
    let cache = this.cacheRecord[cacheKey];

    if (!cache) {
      cache = new LRU(this.cacheOptions);
      this.cacheRecord[cacheKey] = cache;
    }

    return cache;
  }

  async getMany<T>(
    cacheKey: string,
    keys: string[],
    getData: TGetManyData<T>,
  ): Promise<SRecord<T>> {
    const cache = this.getCache(cacheKey);
    const result: SRecord<T> = {};
    const unCachedKeys: string[] = [];

    keys.forEach((key) => {
      const cachedData = cache.get(key) as T;

      if (cachedData) {
        result[key] = cachedData;
      } else {
        unCachedKeys.push(key);
      }
    });

    if (!unCachedKeys.length) return result;

    const unCachedData = await getData(unCachedKeys);

    _.forEach(unCachedData, (data, key) => {
      cache.set(key, data);
      result[key] = data;
    });

    return result;
  }

  async getOne<T>(cacheKey: string, key: string, getData: TGetOneData<T>): Promise<T> {
    const cache = this.getCache(cacheKey);

    const cachedData = cache.get(key) as T;

    if (cachedData) return cachedData;

    const data = await getData(key);

    cache.set(key, data);

    return data;
  }
}
