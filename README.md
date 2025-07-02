Create Order

| #   | Name                                                                                           | Test Data                                                          | Status     | Comment       |
|:----|:-----------------------------------------------------------------------------------------------|:-------------------------------------------------------------------|:-----------|:--------------|
| 1.  | GET request with valid username and password returns 200 OK and api_key                        | username = username, password = password                           | [x] passed |               |
| 2.  | GET request with valid username and empty password returns 500                                 | username = username, password =                                    | [x] passed | 400 is better |
| 3.  | GET request with object username and valid password returns 400                                | username = {"a": 1}, password = password                           | [x] passed |               |
| 4.  | PUT request with 16-digits api_key, valid id and full and valid body returns 200 OK            | api_key = 1234567890123456, id = 5 , full & valid Request Body     | [x] passed |               |
| 5.  | PUT request with empty api_key, valid id and valid body returns 401 UNAUTHORIZED               | empty api_key, id = 5, full & valid Request Body                   | [x] passed |               |
| 6.  | PUT request with 15-digits api_key, valid id and valid body returns 401 UNAUTHORIZED           | api_key = 123456789012345, id = 5, full & valid Request Body       | [x] passed |               |
| 7.  | PUT request with 17-digits api_key, valid id and valid body returns 401 UNAUTHORIZED           | api_key = 12345678901234567, id = 5, full & valid Request Body     | [x] passed |               |
| 8.  | PUT request with 1-digit api_key, valid id and valid body returns 401 UNAUTHORIZED             | api_key = 1, id = 5, full & valid Request Body                     | [x] passed |               |
| 9.  | PUT request with 16-digits api_key, invalid id and full and valid body returns 400 BAD_REQUEST | api_key = 1234567890123456, id = 'test', full & valid Request Body | [x] passed |               |
| 10. | PUT request with 16-digits api_key, valid id (path), no request body returns 400 BAD_REQUEST   | api_key = 1234567890123456, id = 5                                 | [x] passed |               |
| 11. | DELETE request with 16-digits api_key, valid id (path) returns 204 NO_CONTENT                  | api_key = 1234567890123456, id = 5                                 | [x] passed |               |
| 12. | DELETE request with empty api_key, valid id (path) returns 401 UNAUTHORIZED                    | empty api_key, id = 5                                              | [x] passed |               |
| 13. | DELETE request with 15-digits api_key, valid id (path) returns 401 UNAUTHORIZED                | api_key = 123456789012345, id = 5                                  | [x] passed |               |
| 14. | DELETE request with 17-digits api_key, valid id (path) returns 401 UNAUTHORIZED                | api_key = 12345678901234567, id = 5                                | [x] passed |               |
| 15. | DELETE request with 1-digit api_key, valid id (path) returns 401 UNAUTHORIZED                  | api_key = 1, id = 5                                                | [x] passed |               |
| 16. | DELETE request without api_key parameter, valid id (path) returns 400 BAD_REQUEST              | api_key = 1, id = 5                                                | [x] passed |               |
| 17. | DELETE request with 16-digits api_key, invalid id returns 400 BAD_REQUEST                      | api_key = 1234567890123456, id = 'test'                            | [x] passed |               |

Loan Risk Calculator

| #   | Name                                                                                    | Test Data                                                                                      | Status     | Comment |
|:----|:----------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------|:-----------|:--------|
| 1.  | Successful request with valid body returns 200 OK, low risk and positive decision       | {"income": 2000, "debt": 0, "age": 25, "employed": true, "loanAmount": 500, "loanPeriod": 12}  | [x] passed |         |
| 2.  | Successful request with valid body returns 200 OK, medium risk and positive decision    | {"income": 2000, "debt": 0, "age": 25, "employed": true, "loanAmount": 500, "loanPeriod": 6}   | [x] passed |         |
| 3.  | Successful request with valid body returns 200 OK, high risk and positive decision      | {"income": 2000, "debt": 0, "age": 25, "employed": true, "loanAmount": 500, "loanPeriod": 3}   | [x] passed |         |
| 4.  | Successful request with valid body returns 200 OK, very high risk and negative decision | {"income": 100, "debt": 0, "age": 17, "employed": true, "loanAmount": 1000, "loanPeriod": 3}   | [x] passed |         |
| 5.  | Unsuccessful request without request body returns 400 BAD_REQUEST                       | no body                                                                                        | [x] passed |         |
| 6.  | Unsuccessful request with empty request body returns 400 BAD_REQUEST                    | {}                                                                                             | [x] passed |         |
| 7.  | Unsuccessful request with zero values request body parameters returns 400 BAD_REQUEST   | {"income": 0, "debt": 0, "age": 0, "employed": true, "loanAmount": 0, "loanPeriod": 0}         | [x] passed |         |
| 8.  | Unsuccessful request with negative debt value returns 400 BAD_REQUEST                   | {"income": 2000, "debt": -5, "age": 25, "employed": true, "loanAmount": 500, "loanPeriod": 12} | [x] passed |         |
| 9.  | Unsuccessful request with negative age value returns 400 BAD_REQUEST                    | {"income": 100, "debt": 0, "age": -5, "employed": true, "loanAmount": 1000, "loanPeriod": 12}  | [x] passed |         |
| 10. | Unsuccessful request with negative loanAmount value returns 400 BAD_REQUEST             | {"income": 2000, "debt": 0, "age": 25, "employed": true, "loanAmount": -5, "loanPeriod": 12}   | [x] passed |         |
| 11. | Unsuccessful request with negative loanPeriod value returns 400 BAD_REQUEST             | {"income": 2000, "debt": 0, "age": 25, "employed": true, "loanAmount": 500, "loanPeriod": -5}  | [x] passed |         |