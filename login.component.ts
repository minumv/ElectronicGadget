import { Component } from '@angular/core';
import { CustomerService } from '../Services/customer.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  LoginFormGroup : FormGroup ;

  constructor(private authService:AuthService, private fb : FormBuilder, private router:Router){
    this.LoginFormGroup = this.fb.group({
        username : ['admin@gmail.com'],
        password : ['Admin@123']
    })
  }

OnSubmit(){
  console.log(this.LoginFormGroup.value);
  this.authService.Login(this.LoginFormGroup.value).subscribe({
    next: (res) => {
      console.log( res.user.roles[0]);
      localStorage.setItem('token', res.token);
      localStorage.setItem('customerId', res.user.id);
      localStorage.setItem('userRole', res.user.roles[0]); 

      if (res.user.roles[0] === 'Admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      console.error('Login failed:', err);
    }
  });
}
  
}


