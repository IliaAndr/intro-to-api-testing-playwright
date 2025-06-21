import { expect, test } from '@playwright/test';

import { StatusCodes } from 'http-status-codes';
import { OrderDto } from './dto/order-dto';

test.describe('lesson examples', () => {
  test('get order with correct id should receive code 200', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1');
    // Log the response status, body and headers
    console.log('response body:', await response.json());
    console.log('response headers:', response.headers());
    // Check if the response status is 200
    expect.soft(response.status()).toBe(200);
  });
  test('post order with correct data should receive code 201', async ({ request }) => {
    // prepare request body
    const requestBody = OrderDto.createOrderWithRandomData();
    // Send a POST request to the server
    const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
      data: requestBody
    });
    // Log the response status and body
    console.log('response status:', response.status());
    console.log('response body:', await response.json());
    expect.soft(response.status()).toBe(StatusCodes.OK);
  });

  test('get order with 0 id should receive code 400', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/0');
    // Log the response status, body and headers
    console.log('response body:', await response.json()); // не хотим выводить в консоль
    console.log('response headers:', response.headers()); // не хотим выводить в консоль
    // Check if the response status is 400
    expect(response.status()).toBe(400);
  });

  test('get order with 11 id should receive code 400', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/11');
    // Log the response status, body and headers
    console.log('response body:', await response.json()); // не хотим выводить в консоль
    console.log('response headers:', response.headers()); // не хотим выводить в консоль
    // Check if the response status is 400
    expect(response.status()).toBe(400);
  });

  test('get order with null id should receive code 400', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/');
    // Log the response status, body and headers
    console.log('response body:', await response.json()); // не хотим выводить в консоль
    console.log('response headers:', response.headers()); // не хотим выводить в консоль
    // Check if the response status is 500
    expect(response.status()).toBe(500);
  });

  test('get order with string id should receive code 400', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/test');
    // Log the response status, body and headers
    console.log('response body:', await response.json()); // не хотим выводить в консоль
    console.log('response headers:', response.headers()); // не хотим выводить в консоль
    // Check if the response status is 400
    expect(response.status()).toBe(400);
  });

  test('post order with incorrect data should receive code 415', async ({ request }) => {
    // prepare request body

    // Send a POST request to the server
    const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
      data: 'test'
    });
    // Log the response status and body
    console.log('response status:', response.status());
    console.log('response body:', await response.json());
    expect(response.status()).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE);
  });
});

// HW-09
// === GET /test-orders ===
test.describe('get tests', () => {
  const baseUrl = 'https://backend.tallinn-learning.ee/test-orders';
  test('get request with valid username and password should return 200 OK and api_key', async ({ request }) => {
    const queryParams = new URLSearchParams({
      username: 'username',
      password: 'password'
    });
    const response = await request.get(`${baseUrl}?${queryParams.toString()}`);
    /*console.log('response body:', await response.json());
    console.log('response headers:', response.headers());
    console.log('Status:', response.status());*/
    expect(response.status()).toBe(StatusCodes.OK);
  });

  test('get request with valid username and empty password should return 500', async ({ request }) => {
    const queryParams = new URLSearchParams({
      username: 'username',
      password: ''
    });
    const response = await request.get(`${baseUrl}?${queryParams.toString()}`);
    /*console.log('response body:', await response.json());
    console.log('response headers:', response.headers());
    console.log('Status:', response.status());*/
    expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  test('get request with object username and valid password should return 400', async ({ request }) => {
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders?username={"a":1}&password=password');
    /*console.log('response headers:', response.headers());
    console.log('Status:', response.status());
    console.log('Content-Type:', response.headers()['content-type']);*/
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });
});

// === PUT /test-orders/{id} ===
test.describe('put tests', () => {
  const baseUrl = 'https://backend.tallinn-learning.ee/test-orders';
  test('put request with 16-digits api_key, valid id and full and valid body returns 200 OK', async ({ request }) => {
    const order = OrderDto.createOrderWithFixedId(5);
    const apiKey = '1234567890123456';
    const response = await request.put(`${baseUrl}/${order.id}`, {
      data: order,
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('request body:', requestBody);
    console.log('api_key:', apiKey);
    console.log('response body:', await response.json());
    console.log('url:', `${baseUrl}/${order.id}`);
    console.log('order id in body:', requestBody.id);*/
    expect.soft(response.status()).toBe(StatusCodes.OK);
  });

  test('put request with empty api_key, valid id and full and valid body returns 401', async ({ request }) => {
    const order = OrderDto.createOrderWithFixedId(5);
    const apiKey = '';
    const response = await request.put(`${baseUrl}/${order.id}`, {
      data: order,
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('request body:', requestBody);
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${order.id}`);
    console.log('order id in body:', requestBody.id);*/
    expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('put request with 15-digits api_key, valid id and full and valid body returns 401', async ({ request }) => {
    const order = OrderDto.createOrderWithFixedId(5);
    const apiKey = '123456789012345';
    const response = await request.put(`${baseUrl}/${order.id}`, {
      data: order,
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('request body:', requestBody);
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${order.id}`);
    console.log('order id in body:', requestBody.id);*/
    expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('put request with 17-digits api_key, valid id and full and valid body returns 401', async ({ request }) => {
    const order = OrderDto.createOrderWithFixedId(5);
    const apiKey = '12345678901234567';
    const response = await request.put(`${baseUrl}/${order.id}`, {
      data: order,
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('request body:', requestBody);
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${order.id}`);
    console.log('order id in body:', requestBody.id);*/
    expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('put request with 1-digit api_key, valid id and full and valid body returns 401', async ({ request }) => {
    const order = OrderDto.createOrderWithFixedId(5);
    const apiKey = '1';
    const response = await request.put(`${baseUrl}/${order.id}`, {
      data: order,
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('request body:', requestBody);
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${order.id}`);
    console.log('order id in body:', requestBody.id);*/
    expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('put request with 16-digits api_key, invalid id and full and valid body returns 400', async ({ request }) => {
    const order = OrderDto.createOrderWithInvalidId('test');
    const apiKey = '1234567890123456';
    const response = await request.put(`${baseUrl}/${order.id}`, {
      data: order,
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('request body:', requestBody);
    console.log('api_key:', apiKey);
    console.log('response body:', await response.json());
    console.log('url:', `${baseUrl}/${order.id}`);
    console.log('order id in body:', requestBody.id);*/
    expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('put request with 16-digits api_key, valid id (path) and empty body returns 400', async ({ request }) => {
    const apiKey = '1234567890123456';
    const id = 5;
    const response = await request.put(`${baseUrl}/${id}`, {
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('request body: <no body sent>');
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${id}`);
    console.log('response body:', await response.text());*/
    expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });
});

// === DELETE /test-orders/{id} ===
test.describe('delete tests', () => {
  const baseUrl = 'https://backend.tallinn-learning.ee/test-orders';
  test('delete request with 16-digits api_key, valid id (path) should return 204', async ({ request }) => {
    const apiKey = '1234567890123456';
    const id = 5;
    const response = await request.delete(`${baseUrl}/${id}`, {
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${id}`);*/
    expect.soft(response.status()).toBe(StatusCodes.NO_CONTENT);
  });

  test('delete request with empty api_key, valid id (path) should return 401 UNAUTHORIZED', async ({ request }) => {
    const apiKey = '';
    const id = 5;
    const response = await request.delete(`${baseUrl}/${id}`, {
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${id}`);*/
    expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('delete request with 15-digits api_key, valid id (path) should return 401 UNAUTHORIZED', async ({ request }) => {
    const apiKey = '123456789012345';
    const id = 5;
    const response = await request.delete(`${baseUrl}/${id}`, {
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${id}`);*/
    expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('delete request with 17-digits api_key, valid id (path) should return 401 UNAUTHORIZED', async ({ request }) => {
    const apiKey = '12345678901234567';
    const id = 5;
    const response = await request.delete(`${baseUrl}/${id}`, {
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${id}`);*/
    expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('delete request 1-digit api_key, valid id (path) should return 401 UNAUTHORIZED', async ({ request }) => {
    const apiKey = '1';
    const id = 5;
    const response = await request.delete(`${baseUrl}/${id}`, {
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${id}`);*/
    expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('delete request without api_key, valid id (path) should return 400', async ({ request }) => {
    const id = 5;
    const response = await request.delete(`${baseUrl}/${id}`, {
      headers: {
        'content-type': 'application/json'
      }
    });
    /*console.log('response status:', response.status());
    //console.log('api_key:', apiKey);
    console.log('response body:', await response.json());
    console.log('url:', `${baseUrl}/${id}`);*/
    expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('delete request with 16-digits api_key, invalid id (path) should return 400', async ({ request }) => {
    const apiKey = '1234567890123456';
    const id = 'test';
    const response = await request.delete(`${baseUrl}/${id}`, {
      headers: {
        'content-type': 'application/json',
        api_key: apiKey
      }
    });
    /*console.log('response status:', response.status());
    console.log('api_key:', apiKey);
    console.log('url:', `${baseUrl}/${id}`);*/
    expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });
});
