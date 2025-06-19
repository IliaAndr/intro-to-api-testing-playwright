export class OrderDto {
  status: string;
  courierId: number | undefined;
  customerName: string;
  customerPhone: string;
  comment: string;
  id: number | undefined;
  //static id: number;

  private constructor(
    customerName: string,
    customerPhone: string,
    comment: string,
    id: number,
    status: string,
    courierId: number | undefined
  ) {
    this.customerName = customerName;
    this.customerPhone = customerPhone;
    this.comment = comment;
    this.id = id;
    this.status = status;
    this.courierId = courierId;
  }
  static createOrderWithRandomData(): OrderDto {
    return new OrderDto(
      'John Doe',
      '+1234567890',
      'test comment',
      Math.floor(Math.random() * 10) + 1,
      'OPEN',
      Math.floor(Math.random() * 100)
    );
  }

  // add a method to create a new instance with fixed id
  static createOrderWithFixedId(id: number): OrderDto {
    const order = this.createOrderWithRandomData();
    order.id = id;
    return order;
  }

  // add a method to create a new instance with orderId = undefined
  static createOrderWithoutId(): OrderDto {
    return new OrderDto(
      'John Doe',
      '+1234567890',
      '+test comment',
      Math.floor(Math.random() * 10) + 1,
      'OPEN',
      undefined
    );
  }

  // add a method to create a new instance with invalid id
  static createOrderWithInvalidId(invalidId: any): OrderDto {
    const order = this.createOrderWithRandomData();
    order.id = invalidId;
    return order;
  }

}
