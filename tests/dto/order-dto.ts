export class OrderDto {
  status: string
  courierId: number | undefined
  customerName: string
  customerPhone: string
  comment: string
  id: number | undefined

  private constructor(
    customerName: string,
    customerPhone: string,
    comment: string,
    id: number,
    status: string,
    courierId: number | undefined,
  ) {
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
    this.id = id
    this.status = status
    this.courierId = courierId
  }
  static createOrderWithRandomData(): OrderDto {
    return new OrderDto(
      'John Doe',
      '+123345678',
      'test comment',
      Math.floor(Math.random() * 100),
      'OPEN',
      Math.floor(Math.random() * 100),
    )
  }
  // add a method to create a new instance with orderid = undefined
  static createOrderWithoutId(): OrderDto {
    return new OrderDto(
      'John Doe',
      'urgent',
      '+123456789',
      Math.floor(Math.random() * 100),
      'OPEN',
      undefined,
    )
  }
}
