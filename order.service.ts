import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../Models/Order';
import { CreateOrderRequest } from '../Models/CreateOrderRequest';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor( private httpClient : HttpClient) { }

  baseUrl = "http://localhost:5155/api/Order";

  CreateOrder(order: CreateOrderRequest): Observable<Order> {    
    return this.httpClient.post<Order>(`${this.baseUrl}`, order);
  }

  GetAllOrder():Observable<Order>{
    return this.httpClient.get<Order>(`${this.baseUrl}`);
  }

}
