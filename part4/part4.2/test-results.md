# Test Results

## Simple TODO JSON API

### Get Todos API performance

- median request duration: 8ms
- 99th Percentile request duration: 12.99ms

### Add Todo API performance

- median request duration: 380µs
- 99th Percentile request duration: 1.09ms

## TODO JSON API with Database

### Get Todos API performance

- median request duration: 1.2ms
- 99th Percentile request duration: 6.2ms

### Add Todo API performance

- median request duration: 1.31ms
- 99th Percentile request duration: 5.22ms

# Reflection

- Median request duration of TODO Get calls in TODO API (with database) was comparatively faster than Simple TODO JSON API due to optimized database queries and cache process. Same for the 99th percentile request duration.

- Median request duration of TODO Add calls in TODO API (with database) was comparatively slower than Simple TODO JSON API probably because of database overhead. Same reason for 99th percentile request duration.

## Possible reason for performance difference

- As discussed above, one reason could be database overhead. Querying and Inserting data operations introduce additional overhead compared to the in-memory operation of the Simple JSON TODO API.
- Despite the overhead, the database-backed API performs better in retrieving the data due to the efficient design and optimization. Proper indexing, querying management and possibly cache system can improve the performance
