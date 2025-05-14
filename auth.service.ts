import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../Models/Customer';
import { Observable } from 'rxjs';
import { LoginResponse } from '../Models/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private httpClient : HttpClient) { }

  baseUrl = 'http://localhost:5155/api/Authenticate';

  Register(cus:Customer): Observable <Customer>{
    cus.id = "00000000-0000-0000-0000-000000000000";
    return this.httpClient.post<Customer>(this.baseUrl+'/register',cus);
  }

  Login(cus:Customer):Observable<LoginResponse>
  {
    return this.httpClient.post<LoginResponse>(this.baseUrl+'/login',cus);
  }

 

  Logout(){

  }

  IsLoggedIn(){

  }

  GetToken(){

  }
}
