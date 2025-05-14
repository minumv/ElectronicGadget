import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/Services/customer.service';
import { Customer } from 'src/app/Models/Customer';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  ProfileFormGroup!:FormGroup;
  customerId!:string;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private custService:CustomerService, private fb:FormBuilder){
    this.ProfileFormGroup = this.fb.group({
      id: [''],
      username: [''],
      name: [''],
      mobileNo: [''],
      email: [''],
      address: ['']     

    })
  }
  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    this.getCustomerDetails();
  }

  getCustomerDetails(){
    this.custService.GetCustomerDetail(this.customerId).subscribe(response=>{
      console.log(response);
     // this.customer = response;
      this.FillForm(response);
      
    })
  }

   FillForm(cus:Customer){
      this.ProfileFormGroup.setValue({          
        id: cus.id,
        username: cus.username,
        name: cus.name,
        mobileNo: cus.mobileNo,
        email: cus.email,
        address: cus.address 
      })
    }

  CreateProfile(){
    this.custService.UpdateCustomer(this.ProfileFormGroup.value).subscribe(res=>{
      this.successMessage = "Profile updated successfully!";
    }, err => {
      this.errorMessage = "Failed to update profile. Please try again.";
    })
  }
}
