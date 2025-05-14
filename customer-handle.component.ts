import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../Services/customer.service';
import { Customer } from '../../Models/Customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-handle',
  templateUrl: './customer-handle.component.html',
  styleUrls: ['./customer-handle.component.css']
})
export class CustomerHandleComponent implements OnInit {

  customerId! : string ;
//  customer! : Customer ;
  CustomerEditFormGroup : FormGroup;

  constructor(private route:ActivatedRoute, private fb:FormBuilder, private cusService:CustomerService, private router:Router){
    this.CustomerEditFormGroup = this.fb.group({
      id: [''],
      username: [''],
      name: [''],
      mobileNo: [''],
      email: [''],
     // password: [''],
      address: ['']     

    })
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.customerId);
    this.getCustomerDetails();
  }

  getCustomerDetails(){
    this.cusService.GetCustomerDetail(this.customerId).subscribe(response=>{
      console.log(response);
     // this.customer = response;
      this.FillForm(response);
      
    })
  }

  OnSubmit(){
    this.cusService.UpdateCustomer(this.CustomerEditFormGroup.value).subscribe(response=>{
      console.log("student already exist, for updation!!")
      console.log(response);
      //this.getStudent();
      this.router.navigate(['/dashboard/customers']);
    })
  }

  FillForm(cus:Customer){
    this.CustomerEditFormGroup.setValue({          
      id: cus.id,
      username: cus.username,
      name: cus.name,
      mobileNo: cus.mobileNo,
      email: cus.email,
     // password: cus.password,
      address: cus.address 
    })
  }

  confirmDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this customer?");
    if (confirmed) {
      this.DeleteCust(this.customerId);
      this.router.navigate(['/dashboard/customers']);
    }
  }

  DeleteCust(id:string){    
      this.cusService.RemoveCustomer(id).subscribe(response=>{
        console.log(response);
        //this.router.navigate(['/dashboard/customers']);
      })
    }
  
}
