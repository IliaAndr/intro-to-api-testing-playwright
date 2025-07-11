import { APIRequestContext, expect } from '@playwright/test';
import { LoginDto } from '../dto/login-dto';
import { OrderDto } from '../dto/order-dto';
import { StatusCodes } from 'http-status-codes';
import { serviceURL, paths } from './config';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getAuthHeaders(jwt: string) {
  return {
    Authorization: `Bearer ${jwt}`
  };
}

export async function loginAndCreateOrder(request: APIRequestContext): Promise<{ jwt: string; orderId: number }> {
  const loginData = LoginDto.createLoginWithCorrectData();
  const orderData = OrderDto.createOrderWithRandomData();

  const loginResponse = await request.post(`${serviceURL}${paths.login}`, {
    data: loginData
  });

  expect.soft(loginResponse.status()).toBe(StatusCodes.OK);
  const jwt = await loginResponse.text();

  const orderResponse = await request.post(`${serviceURL}${paths.order}`, {
    data: orderData,
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });

  expect.soft(orderResponse.status()).toBe(StatusCodes.OK);
  const responseBody = await orderResponse.json();

  return {
    jwt,
    orderId: responseBody.id
  };
}
