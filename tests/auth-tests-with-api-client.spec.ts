import { expect, test } from '@playwright/test';
import { ApiClient } from './api/api-client';
import { StatusCodes } from 'http-status-codes';

test.describe('auth tests with API Client', () => {
  let apiClient: ApiClient;
  let orderId: number;

  test.beforeEach(async ({ request }) => {
    apiClient = await ApiClient.getInstance(request);
    orderId = await apiClient.createOrderAndReturnOrderId();
    expect.soft(orderId).toBeDefined();
  });

  test('login and create order', async () => {
    console.log('orderId:', orderId);
  });

  test('login and delete an existing order', async () => {
    console.log('orderId:', orderId);
    const response = await apiClient.deleteOrder(orderId);
    const responseBody = await response.ok();
    expect(response.status()).toBe(StatusCodes.OK);
    expect(responseBody).toBeTruthy();
  });

  test('should create an order and retrieve it by id', async () => {
    const foundOrder = await apiClient.findOrder(orderId);
    expect.soft(foundOrder).toBeDefined();
    expect.soft(foundOrder.id).toBe(orderId);
  });

  test('should create an order, delete it and verify that it is deleted', async () => {
    const deleteResponse = await apiClient.deleteOrder(orderId);
    expect.soft(deleteResponse.status()).toBe(StatusCodes.OK);

    const getDeletedOrderResponse = await apiClient.getOrderResponseRaw(orderId);
    expect.soft([StatusCodes.OK, StatusCodes.NOT_FOUND].includes(getDeletedOrderResponse.status())).toBeTruthy();

    const bodyText = await getDeletedOrderResponse.text();
    expect.soft(bodyText).toBe('');

    if (bodyText === '') {
      console.log('Order was deleted successfully — no data returned.');
    } else {
      console.log('Unexpected response body for deleted order:', bodyText);
    }
  });
});
