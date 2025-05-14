export interface CreateOrderRequest {
    customerId: string;
    total: number;
    orderStatus: string;
    paymentMethod: string;
    orderItems: {
      productId: string;
      quantity: number;
    }[];
  }