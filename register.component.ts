import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Customer } from '../Models/Customer';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  Customerarray : Customer[]= []
  RegisterFormGroup : FormGroup;

ngOnInit(): void {
 
}

constructor(private authService : AuthService, private fb : FormBuilder){
  this.RegisterFormGroup = this.fb.group({
    //id : [''],
    username  : [''],
   // name : [''],
    email : [''],
    password : [''],
    //mobileNo : [''],
   // address : ['']
  })
}

OnSubmit(){
  console.log(this.RegisterFormGroup.value);
  this.authService.Register(this.RegisterFormGroup.value).subscribe(response => {
    console.log(response);
    this.RegisterFormGroup.setValue({
     // id : "",
      username  : "",
     // name : "",
      email : "",
      password : "",
     // mobileNo : "",
      //address : ""
    })
    
  })
  
}

}
