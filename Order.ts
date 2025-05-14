import { OrderProduct } from "./OrderProduct";
export interface Order{
    id: string;
  customerId: string;
  orderDate: Date;
  total: number;
  orderStatus: string;
  paymentMethod: string;
  products: OrderProduct[];
}