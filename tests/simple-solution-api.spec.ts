import { expect, test } from '@playwright/test';

import { StatusCodes } from 'http-status-codes';
import { OrderDto } from './dto/order-dto';

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
  console.log('response body:', await response.json()) // не хотим выводить в консоль
  console.log('response headers:', response.headers()) // не хотим выводить в консоль
  // Check if the response status is 400
  expect(response.status()).toBe(400);
});

test('get order with 11 id should receive code 400', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/11');
  // Log the response status, body and headers
  console.log('response body:', await response.json()) // не хотим выводить в консоль
  console.log('response headers:', response.headers()) // не хотим выводить в консоль
  // Check if the response status is 400
  expect(response.status()).toBe(400);
});

test('get order with null id should receive code 400', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/');
  // Log the response status, body and headers
  console.log('response body:', await response.json()) // не хотим выводить в консоль
  console.log('response headers:', response.headers()) // не хотим выводить в консоль
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
// HW-09
// === GET /test-orders ===
test.describe('get tests', () => {
  test('get request with valid username and password should return 200 OK and api_key', async ({
    request
  }) => {
    const response = await request.get(
      'https://backend.tallinn-learning.ee/test-orders?username=username&password=password'
    );
    console.log('response body:', await response.json());
    console.log('response headers:', response.headers());
    expect(response.status()).toBe(StatusCodes.OK);
  });

  test('get request with valid username and empty password should return 500', async ({
    request
  }) => {
    const response = await request.get(
      'https://backend.tallinn-learning.ee/test-orders?username=username&password='
    );
    console.log('response body:', await response.json());
    console.log('response headers:', response.headers());
    expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  test('get request with object username and valid password should return 400', async ({
    request
  }) => {
    const response = await request.get(
      'https://backend.tallinn-learning.ee/test-orders?username={"a":1}&password=password'
    );
    console.log('response headers:', response.headers());
    console.log('Status:', response.status());
    console.log('Content-Type:', response.headers()['content-type']);
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });
});
