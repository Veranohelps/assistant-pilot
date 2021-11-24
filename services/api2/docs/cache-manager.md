# Cache Manager

A simple read-through cache built on [lru-cache](https://github.com/isaacs/node-lru-cache).

## API

the cacheManager is initialized with an optional options parameter. Options provided are basically forwarded to the underlying LRU cache. See all available options [here](https://github.com/isaacs/node-lru-cache#options);

```TypeScript
const cache = new CacheManager({ max: 1000, maxAge: 60000 });
```

### `getOne`

gets a single item from the cache, called with 3 arguments

- cacheKey - the cache identifier within the cacheManager instance
- key
- a callback taking a string as an argument and retuning a Promise that resolves to the data that would be stored in the cache

```TypeScript
const cache = new CacheManager();

const data = await cache.getOne(
  'myCache',
  'userId',
  (id: string) => getUserFromDB(id), // called as the data doesn't exist in the cache
);

const data2 = await cache.getOne(
  'myCache',
  'userId',
  (id: string) => getUserFromDB(id), // not called, data is read from cache
);
```

### `getMany`

same as `getOne` but for many, called with 3 arguments

- cacheKey - the cache identifier within the cacheManager instance
- keys - an array of identifiers for the cached data
- a callback taking a list of identifiers as an argument and retuning a Promise that resolves to dictionary with the structure `{ [key: identifier]: { ...data to be cached } }`

```TypeScript
const cache = new CacheManager();

const data = await cache.getOne(
  'myCache',
  ['userId', 'userId2', 'userId3'],
  (ids: string[]) => getUsersFromDB(ids), // called with ['userId', 'userId2', 'userId3'] as none exists in the cache
);

const data2 = await cache.getOne(
  'myCache',
  ['userId3', 'userId4'],
  (ids: string[]) => getUsersFromDB(ids), // called with ['userId4'] as 'userId3' already exists in the cache
);

const data2 = await cache.getOne(
  'myCache',
  ['userId2', 'userId3'],
  (ids: string[]) => getUsersFromDB(ids), // not called, all keys exist in cache
);
```

### `getCache`

retrieves the LRU cache associated with the cache key or initializes one if as cache isn't associated with the key yet, useful if you want to interact with the cache directly

```TypeScript
const cache = new CacheManager();
const myCache = cache.getCache('myCache'); // the cache, break a leg
```

## Usage Notes

If you feel like caching would help optimize a process, try CacheManager
