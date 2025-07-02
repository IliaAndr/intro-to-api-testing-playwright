import { expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { LoginDto } from './dto/login-dto';
import { OrderDto } from './dto/order-dto';

const serviceURL = 'https://backend.tallinn-learning.ee/';
const loginPath = 'login/student';
const orderPath = 'orders';

const jwtPattern = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

test.describe('Tallinn delivery API tests', () => {
  test('login with correct data and verify auth token', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    console.log('requestBody:', requestBody);
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody
    });
    const responseBody = await response.text();

    console.log('response code:', response.status());
    console.log('response body:', responseBody);
    expect(response.status()).toBe(StatusCodes.OK);
    expect(jwtPattern.test(responseBody)).toBeTruthy();

    const jwtValue = await response.text();
    const jwtRegex = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    expect(jwtValue).toMatch(jwtRegex);
  });

  test('login with incorrect data and verify response code 401', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithIncorrectData();
    console.log('requestBody:', requestBody);
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody
    });
    const responseBody = await response.text();

    console.log('response code:', response.status());
    console.log('response body:', responseBody);
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED);
    expect(responseBody).toBe('');
  });

  test('login and create order', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody
    });
    const jwt = await response.text();
    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: OrderDto.createOrderWithoutId(),
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    const orderResponseBody = await orderResponse.json();
    console.log('orderResponse status:', orderResponse.status());
    console.log('orderResponse:', orderResponseBody);
    expect.soft(orderResponse.status()).toBe(StatusCodes.OK);
    expect.soft(orderResponseBody.status).toBe('OPEN');
    expect.soft(orderResponseBody.id).toBeDefined();
  });

  test('request with invalid HTTP method returns 405', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const response = await request.get(`${serviceURL}${loginPath}`, {
      data: requestBody
    });
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED);
  });

  test('request with array instead of object returns 400', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const invalidRequestBody = [requestBody];
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: invalidRequestBody
    });
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('request with string instead of object returns 400', async ({ request }) => {
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: 'username=test&password=test',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('request with empty body returns 4xx', async ({ request }) => {
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: {},
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.status()).not.toBe(StatusCodes.OK);
  });

  test('request with null body returns 400', async ({ request }) => {
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: null
    });
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('request with missing username returns 4xx', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const invalidRequestBody = {
      password: requestBody.password
    };
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: invalidRequestBody
    });
    expect(response.status()).not.toBe(StatusCodes.OK);
  });

  test('request with missing password returns 4xx', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const invalidRequestBody = {
      username: requestBody.username
    };
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: invalidRequestBody
    });
    expect(response.status()).not.toBe(StatusCodes.OK);
  });

  test('request with wrong content-type header returns 415', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    expect(response.status()).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE);
  });
});
