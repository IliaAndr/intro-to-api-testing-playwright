//eslint-disable-next-line @typescript-eslint/no-require-imports
const axios = require('axios');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test: test, describe, expect } = require('@jest/globals');
//eslint-disable-next-line @typescript-eslint/no-require-imports
const { OrderDto } = require('./dto/order-dto');

describe('API tests', () => {
  const baseUrl = 'https://backend.tallinn-learning.ee/test-orders';
  const apiKey = '1234567890123456';
  test('get authentication with valid username/password pair should return 200', async () => {
    const queryParams = new URLSearchParams({
      username: 'username',
      password: 'password'
    });
    //const response = await axios.get('https://backend.tallinn-learning.ee/test-orders?username=username&password=password');
    const response = await axios.get(`${baseUrl}?${queryParams.toString()}`);
    //console.log('response body:', await response.data)
    //console.log('response headers:', response.headers)
    expect(response.status).toBe(200);
  });

  test('put request with full and valid body, valid id and 16-digits api_key should return 200', async () => {
    const order = OrderDto.createOrderWithFixedId(5);
    const response = await axios.put(`${baseUrl}/${order.id}`, order, {
      headers: {
        'Content-Type': 'application/json',
        api_key: apiKey
      }
    });
    expect(response.status).toBe(200);
  });

  test('delete request with 16-digits api_key, valid id (path) returns 204', async () => {
    const id = 5;
    const response = await axios.delete(`${baseUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        api_key: apiKey
      }
    });
    expect(response.status).toBe(204);
  });
});
