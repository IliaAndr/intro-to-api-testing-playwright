import { expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { LoginDto } from './dto/login-dto';
import { OrderDto } from './dto/order-dto';
import { loginAndCreateOrder } from './helpers/order-utils';
import { getAuthHeaders } from './helpers/order-utils';
import { serviceURL, paths } from './helpers/config';

const jwtPattern = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

test.describe('Tallinn delivery API tests', () => {
  test('login with correct data and verify auth token', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    console.log('requestBody:', requestBody);
    const response = await request.post(`${serviceURL}${paths.login}`, {
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
    const response = await request.post(`${serviceURL}${paths.login}`, {
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
    const response = await request.post(`${serviceURL}${paths.login}`, {
      data: requestBody
    });
    const jwt = await response.text();
    const orderResponse = await request.post(`${serviceURL}${paths.order}`, {
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
    const response = await request.get(`${serviceURL}${paths.login}`, {
      data: requestBody
    });
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED);
  });

  test('request with array instead of object returns 400', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const invalidRequestBody = [requestBody];
    const response = await request.post(`${serviceURL}${paths.login}`, {
      data: invalidRequestBody
    });
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('request with string instead of object returns 400', async ({ request }) => {
    const response = await request.post(`${serviceURL}${paths.login}`, {
      data: 'username=test&password=test',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('request with empty body returns 4xx', async ({ request }) => {
    const response = await request.post(`${serviceURL}${paths.login}`, {
      data: {},
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.status()).not.toBe(StatusCodes.OK);
  });

  test('request with null body returns 400', async ({ request }) => {
    const response = await request.post(`${serviceURL}${paths.login}`, {
      data: null
    });
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('request with missing username returns 4xx', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const invalidRequestBody = {
      password: requestBody.password
    };
    const response = await request.post(`${serviceURL}${paths.login}`, {
      data: invalidRequestBody
    });
    expect(response.status()).not.toBe(StatusCodes.OK);
  });

  test('request with missing password returns 4xx', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const invalidRequestBody = {
      username: requestBody.username
    };
    const response = await request.post(`${serviceURL}${paths.login}`, {
      data: invalidRequestBody
    });
    expect(response.status()).not.toBe(StatusCodes.OK);
  });

  test('request with wrong content-type header returns 415', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData();
    const response = await request.post(`${serviceURL}${paths.login}`, {
      data: requestBody,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    expect(response.status()).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE);
  });
});

test.describe('tests without using API client', () => {
  let jwt: string;
  let orderId: number;

  test.beforeEach(async ({ request }) => {
    const result = await loginAndCreateOrder(request);
    jwt = result.jwt;
    orderId = result.orderId;
  });

  test('successful authorization and finding order by id', async ({ request }) => {
    const findOrderResponse = await request.get(`${serviceURL}${paths.order}/${orderId}`, {
      headers: getAuthHeaders(jwt)
    });
    const foundOrder = await findOrderResponse.json();
    console.log('Order found:', foundOrder);
    expect.soft(findOrderResponse.status(), 'Order should be found by id').toBe(StatusCodes.OK);
    expect.soft(foundOrder.id).toBe(orderId);
  });

  test('successful authorization and deleting order by id', async ({ request }) => {
    const deleteResponse = await request.delete(`${serviceURL}${paths.delete}/${orderId}`, {
      headers: getAuthHeaders(jwt)
    });
    const deletedOrderBody = await deleteResponse.json();
    console.log('delete order status code: ', deleteResponse.status());
    console.log('deleted order body ', deletedOrderBody);
    expect.soft(deleteResponse.status()).toBe(StatusCodes.OK);

    const getResponse = await request.get(`${serviceURL}${paths.get}/${orderId}`, {
      headers: getAuthHeaders(jwt)
    });
    expect.soft([StatusCodes.OK, StatusCodes.NOT_FOUND].includes(getResponse.status())).toBeTruthy();
    const getResponseText = await getResponse.text();
    expect.soft(getResponseText).toBe('');
    console.log('get deleted order status code: ', getResponse.status());
    console.log('get deleted order response body: ', getResponseText);

    if (getResponseText === '') {
      console.log('Order was deleted successfully — no data returned.');
    } else {
      console.log('Unexpected response body for deleted order:', getResponseText);
    }
  });
});
