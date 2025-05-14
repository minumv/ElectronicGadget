import { Component, OnInit } from '@angular/core';
import { Customer } from '../../Models/Customer';
import { CustomerService } from '../../Services/customer.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit{
  CustomerArray : Customer[] = [];
  
  title = 'Customer Details';
  ngOnInit(): void {
      this.getCustomers();
  }

  constructor(private cusService : CustomerService){}

  getCustomers(){
    this.cusService.GetCustomers().subscribe(response=>{
      console.log(response);
      this.CustomerArray = response;      
    })
  }
}
