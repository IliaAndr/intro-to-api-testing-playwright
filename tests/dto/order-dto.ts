export class OrderDto {
  status: string
  courierId: number
  customerName: string
  customerPhone: string
  comment: string
  id: number

  private constructor(
    customerName: string,
    customerPhone: string,
    comment: string,
    id: number,
    status: string,
    courierId: number,
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
}
