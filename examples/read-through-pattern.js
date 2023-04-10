cache.onMiss = (key) => {
  return db.get(key);
};
// register the function that will be executed on cache misses.
cache.onmiss = (key) => {
  return db.get(key); // return data from the database
};

// Actual data from the cache or onmiss handler
// A cache entry is created automatically on cache misses
// through the key and time-to-live values after the data
// is retrieved from the database
const data = cache.readThrough(key, data, ttl);
