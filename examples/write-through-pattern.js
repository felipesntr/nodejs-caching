//The following is a pseudocode example of write-through logic.
function updateCustomer(customerId, customerData) {
  // the callback function will be executed after updating the
  // record in the cache
  cache.writeThrough(
    customerId,
    customerData,
    cache.defaultTTL,
    (key, value) => {
      return db.save(key, value); // save updated data to db
    }
  );
}

// A variant is of this pattern is when updated in the db first
// and immediately updated in the cache
function updateCustomer(customerId, customerData) {
  // update the record in the database first
  const record = db.findAndUpdate(customerId, customerData);

  // then set or update the record in the cache
  cache.set(customerId, record, cache.defaultTTL);
}
