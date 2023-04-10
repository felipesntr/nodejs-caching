class MakeAQuery {
  cache = {};
  database = {};
  constructor(cache, database) {
    this.cache = cache;
    this.database = database;
  }
  execute(key) {
    // try to get the entity from the cache
    let data = this.cache.get(key);
    // if there's a cache miss, get the data from the original store and cache it
    if (data === null) {
      data = this.database.get(key);
      // then store the data to cache with an appropriate expiry time
      // to prevent staleness
      this.cache.set(key, data, cache.defaultExpiryTime);
    }
    // return the data to the application
    return data;
  }
}