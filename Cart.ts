import { Product } from "./Product";
export interface Cart{
    id : string,
    productId : string,
    customerId : string,
    quantity : number,
    product: Product;
}