import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../Models/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClient:HttpClient) { }

  baseUrl = "http://localhost:5155/api/Cart";

  GetCartItems(cid:string):Observable<Cart[]> {
    return this.httpClient.get<Cart[]>(this.baseUrl+'/items/'+cid);
  }

  // GetUserCartProduct(cid:string, pid:string) : Observable <Cart>{
  //   return this.httpClient.get<Cart>(this.baseUrl+'/'+cid+'/'+pid);
  // }

  GetCartItemCount(cid:string) : Observable <number>{
    return this.httpClient.get<number>(this.baseUrl+'/count/'+cid);
  }

  AddProductToCart(cid:string, pid:string) : Observable <Cart>{
    return this.httpClient.post<Cart>(`${this.baseUrl}/${cid}/${pid}`,{});
  }

  IncrementCartItem( id:string, pdtid:string )  : Observable <Cart>{
      return this.httpClient.put<Cart>(`${this.baseUrl}/increment/${id}/${pdtid}`,{})
  }

  DecrementCartItem( id:string, pdtid:string )  : Observable <Cart>{
    return this.httpClient.put<Cart>(`${this.baseUrl}/decrement/${id}/${pdtid}`,{})
  }

  RemoveCartItem( id:string, pdtid:string )  : Observable <Cart>{
    return this.httpClient.delete<Cart>(`${this.baseUrl}/item/${id}/${pdtid}`)
  }

  RemoveCart( id:string )  : Observable <Cart>{
    return this.httpClient.delete<Cart>(`${this.baseUrl}/all/${id}`)
  }

}
