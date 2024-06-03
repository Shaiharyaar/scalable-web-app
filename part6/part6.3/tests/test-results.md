# Performance test results

Used Server: HTTP/1.1

### Brief description of my computer:

#### Macbook Pro 2020

Processor: 2 GHz Quad-Core Intel Core i5
Graphics: Intel Iris Plus Graphics 1536 MB
Memory: 16 GB 3733 MHz LPDDR4X

## No Redis Cache

### Retrieving todos

http_reqs: 11546 1154.03683/s
http_req_duration - median: 6.24ms
http_req_duration - 99th percentile: 34.38ms

## Redis Cache

### Retrieving todos

http_reqs: 13836 1382.847178/s
http_req_duration - median: 5.85ms
http_req_duration - 99th percentile: 19.01ms

## Reflection

There is a noticeable increase, about 19.8%, in requests per second, when redis cache was used. Similarly, there is a significant 44.7% reduction in 99th percentile request duration and 6.25% reduction in Median request duration when redis cache was used.
With redis caching, the frequently accessed data is stored in memory, which then significantly reduce the need for server to get data from database and instead retrieve it from memory which in return helps in following

- Faster data access -> retrieving data from in-memory is much faster so quick access to data.
- Reduces database load -> reduces load on database, allow database to operate other queries more efficiently.
- Lower latency -> majority of requests load faster due to caching, leading to improvement in latency.
