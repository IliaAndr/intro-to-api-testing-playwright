import { APIRequestContext, APIResponse } from 'playwright';
import { LoginDto } from '../dto/login-dto';
import { StatusCodes } from 'http-status-codes';
import { expect } from '@playwright/test';
import { OrderDto } from '../dto/order-dto';
import { serviceURL, paths } from '../helpers/config';

export class ApiClient {
  static instance: ApiClient;
  private request: APIRequestContext;
  private jwt: string = '';

  private constructor(request: APIRequestContext) {
    this.request = request;
  }

  public static async getInstance(request: APIRequestContext): Promise<ApiClient> {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(request);
      await this.instance.requestJwt();
    }
    return ApiClient.instance;
  }

  private async requestJwt(): Promise<void> {
    console.log('Requesting JWT...');
    const authResponse = await this.request.post(`${serviceURL}${paths.login}`, {
      data: LoginDto.createLoginWithCorrectData()
    });
    // Check response status for negative cases
    if (authResponse.status() !== StatusCodes.OK) {
      console.log('Authorization failed');
      throw new Error(`Request failed with status ${authResponse.status()}`);
    }

    // Save the JWT token as a client property
    this.jwt = await authResponse.text();
    console.log('jwt received:');
    console.log(this.jwt);
  }

  async createOrderAndReturnOrderId(): Promise<number> {
    console.log('Creating order...');
    const response = await this.request.post(`${serviceURL}${paths.order}`, {
      data: OrderDto.createOrderWithRandomData(),
      headers: {
        Authorization: `Bearer ${this.jwt}`
      }
    });
    console.log('Order response status:', response.status());
    const responseBody = await response.json();
    console.log('Order response body:', responseBody);

    expect(response.status()).toBe(StatusCodes.OK);

    console.log('Order created: ');
    console.log(responseBody);

    return responseBody.id;
  }

  async deleteOrder(orderId: number): Promise<APIResponse> {
    console.log('Deleting order...');
    const response = await this.request.delete(`${serviceURL}${paths.delete}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`
      }
    });
    console.log('Delete response status:', response.status());
    const responseBody = await response.json();
    console.log('Order deleted response body:', responseBody);
    return response;
  }

  async findOrder(orderId: number): Promise<OrderDto> {
    console.log('Getting order...');
    const gettingOrderResponse = await this.request.get(`${serviceURL}${paths.get}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`
      }
    });
    const responseBody = await gettingOrderResponse.json();
    console.log('Getting order response status:', gettingOrderResponse.status());
    console.log('Getting order response body:', responseBody);
    expect(gettingOrderResponse.status()).toBe(StatusCodes.OK);

    return responseBody;
  }

  async getOrderResponseRaw(orderId: number): Promise<APIResponse> {
    return await this.request.get(`${serviceURL}${paths.order}/${orderId}`, {
      headers: { Authorization: `Bearer ${this.jwt}` }
    });
  }
}
