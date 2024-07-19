# K6 tests

### GET Questions test

```
     checks.........................: 100.00% ✓ 4532       ✗ 0   
     data_received..................: 27 MB   2.7 MB/s
     data_sent......................: 820 kB  82 kB/s
     http_req_blocked...............: med=3µs     p(99)=20.68µs 
     http_req_connecting............: med=0s      p(99)=0s      
     http_req_duration..............: med=17.83ms p(99)=82.12ms 
       { expected_response:true }...: med=17.83ms p(99)=82.12ms 
     http_req_failed................: 0.00%   ✓ 0          ✗ 4532
     http_req_receiving.............: med=72µs    p(99)=226.44µs
     http_req_sending...............: med=18µs    p(99)=63.68µs 
     http_req_tls_handshaking.......: med=0s      p(99)=0s      
     http_req_waiting...............: med=17.75ms p(99)=82.05ms 
     http_reqs......................: 4532    452.564599/s
     iteration_duration.............: med=18.06ms p(99)=82.32ms 
     iterations.....................: 4532    452.564599/s
     vus............................: 10      min=10       max=10
     vus_max........................: 10      min=10       max=10
```

### POST Question test

``` 
     checks.........................: 100.00% ✓ 2956       ✗ 0   
     data_received..................: 426 kB  42 kB/s
     data_sent......................: 733 kB  73 kB/s
     http_req_blocked...............: med=3µs     p(99)=15.44µs 
     http_req_connecting............: med=0s      p(99)=0s      
     http_req_duration..............: med=29.12ms p(99)=113.33ms
       { expected_response:true }...: med=29.12ms p(99)=113.33ms
     http_req_failed................: 0.00%   ✓ 0          ✗ 2956
     http_req_receiving.............: med=43µs    p(99)=98.89µs 
     http_req_sending...............: med=22µs    p(99)=66µs    
     http_req_tls_handshaking.......: med=0s      p(99)=0s      
     http_req_waiting...............: med=29.03ms p(99)=113.26ms
     http_reqs......................: 2956    293.959529/s
     iteration_duration.............: med=29.34ms p(99)=113.56ms
     iterations.....................: 2956    293.959529/s
     vus............................: 10      min=10       max=10
     vus_max........................: 10      min=10       max=10
```

### Upvote Question

```
        
     checks.........................: 100.00% ✓ 4060       ✗ 0   
     data_received..................: 585 kB  58 kB/s
     data_sent......................: 853 kB  85 kB/s
     http_req_blocked...............: med=4µs     p(99)=19µs    
     http_req_connecting............: med=0s      p(99)=0s      
     http_req_duration..............: med=20.23ms p(99)=105.72ms
       { expected_response:true }...: med=20.23ms p(99)=105.72ms
     http_req_failed................: 0.00%   ✓ 0          ✗ 4060
     http_req_receiving.............: med=50µs    p(99)=135µs   
     http_req_sending...............: med=25µs    p(99)=70.4µs  
     http_req_tls_handshaking.......: med=0s      p(99)=0s      
     http_req_waiting...............: med=20.16ms p(99)=105.64ms
     http_reqs......................: 4060    404.455264/s
     iteration_duration.............: med=20.47ms p(99)=106.04ms
     iterations.....................: 4060    404.455264/s
     vus............................: 10      min=10       max=10
     vus_max........................: 10      min=10       max=10
```

### GET Answers test

```
     checks.........................: 100.00% ✓ 4575       ✗ 0   
     data_received..................: 22 MB   2.2 MB/s
     data_sent......................: 878 kB  88 kB/s
     http_req_blocked...............: med=3µs     p(99)=25µs   
     http_req_connecting............: med=0s      p(99)=0s     
     http_req_duration..............: med=17.45ms p(99)=79.38ms
       { expected_response:true }...: med=17.45ms p(99)=79.38ms
     http_req_failed................: 0.00%   ✓ 0          ✗ 4575
     http_req_receiving.............: med=76µs    p(99)=211µs  
     http_req_sending...............: med=18µs    p(99)=79µs   
     http_req_tls_handshaking.......: med=0s      p(99)=0s     
     http_req_waiting...............: med=17.35ms p(99)=79.29ms
     http_reqs......................: 4575    456.935137/s
     iteration_duration.............: med=17.69ms p(99)=79.6ms 
     iterations.....................: 4575    456.935137/s
     vus............................: 10      min=10       max=10
     vus_max........................: 10      min=10       max=10
```

### POST Answer test

```
     checks.........................: 100.00% ✓ 3841       ✗ 0   
     data_received..................: 553 kB  55 kB/s
     data_sent......................: 937 kB  94 kB/s
     http_req_blocked...............: med=4µs     p(99)=22.19µs 
     http_req_connecting............: med=0s      p(99)=0s      
     http_req_duration..............: med=21.66ms p(99)=99.01ms 
       { expected_response:true }...: med=21.66ms p(99)=99.01ms 
     http_req_failed................: 0.00%   ✓ 0          ✗ 3841
     http_req_receiving.............: med=47µs    p(99)=134.59µs
     http_req_sending...............: med=24µs    p(99)=69µs    
     http_req_tls_handshaking.......: med=0s      p(99)=0s      
     http_req_waiting...............: med=21.59ms p(99)=98.95ms 
     http_reqs......................: 3841    383.716859/s
     iteration_duration.............: med=21.92ms p(99)=99.22ms 
     iterations.....................: 3841    383.716859/s
     vus............................: 10      min=10       max=10
     vus_max........................: 10      min=10       max=10
```