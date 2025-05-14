import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../Models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor( private httpClient : HttpClient ) { }
  
  baseUrl = "http://localhost:5155/api/Product";

  GetProducts() : Observable<Product[]>{
      return this.httpClient.get<Product[]>(this.baseUrl);
  }

  CreateProduct( pdt : FormData ) : Observable <any> {
      //pdt.id = "00000000-0000-0000-0000-000000000000";
      return this.httpClient.post<Product>(this.baseUrl,pdt);
  }

  UpdateProduct(  id : string,pdt : FormData ) : Observable <Product> {
    return this.httpClient.put<Product>(this.baseUrl+'/'+id, pdt);
  }

  RemoveProduct( id : string ) : Observable <Product> {
    return this.httpClient.delete<Product>(this.baseUrl+'/'+id);
  }

  GetProductDetail( id : string ) : Observable <Product> {
      return this.httpClient.get<Product>(this.baseUrl+'/'+id);
    }
}
