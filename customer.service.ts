import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../Models/Customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor( private httpClient:HttpClient) { }

  baseUrl = 'http://localhost:5155/api/Customer';

 
  GetCustomers(): Observable <Customer[]> {
      return this.httpClient.get<Customer[]>(this.baseUrl);
  }
 
  UpdateCustomer( cus : Customer ) : Observable <Customer> {
      return this.httpClient.put<Customer>(this.baseUrl+'/'+cus.id,cus);
  }

  RemoveCustomer( id : string ): Observable <Customer> {
      return this.httpClient.delete<Customer>(this.baseUrl+'/'+id);
  }

  GetCustomerDetail( id : string ) : Observable <Customer> {
    return this.httpClient.get<Customer>(this.baseUrl+'/'+id);
  }
}
