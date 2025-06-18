
| #  | Name                                                                                   | Test Data                                                      | Status     | Comment       |
|:---|:---------------------------------------------------------------------------------------|:---------------------------------------------------------------|:-----------|:--------------|
| 1. | GET request with valid username and password returns 200 OK and api_key                | username = username, password = password                       | [x] passed |               |
| 2. | GET request with valid username and empty password returns 500                         | username = username, password =                                | [x] passed | 400 is better |
| 3. | GET request with object username and valid password returns 400                        | username = {"a": 1}, password = password                       | [x] passed |               |
| 1. | PUT request with 16-digits api_key, valid id and full and valid body returns 200 OK    | api_key = 1234567890123456, id = 5, full & valid Request Body  | [ ]        |               |
| 2. | PUT request without api_key, w/valid id and valid body returns 401 UNAUTHORIZED        | no api_key, id = 5, full & valid Request Body                  | [ ]        |               |
| 3. | PUT request with 15-digits api_key, w/valid id and valid body returns 401 UNAUTHORIZED | api_key = 123456789012345, id = 5, full & valid Request Body   | [ ]        |               |
| 4. | PUT request with 17-digits api_key, w/valid id and valid body returns 401 UNAUTHORIZED | api_key = 12345678901234567, id = 5, full & valid Request Body | [ ]        |               |
| 5. | PUT request with 1-digit api_key, w/valid id and valid body returns 401 UNAUTHORIZED   | api_key = 1, id = 5, full & valid Request Body                 | [ ]        |               |


