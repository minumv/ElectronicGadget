import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  count!:number;
  customerId!:string;
  constructor(private router: Router, private cartService : CartService) {}

  ngOnInit(): void {    
    this.customerId = localStorage.getItem('customerId') || '';
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    const role = localStorage.getItem('userRole');
    if(role === 'Customer'){
      this.GetCartCount();
    }   
  }

  GetCartCount(){
    this.cartService.GetCartItemCount(this.customerId).subscribe(response=>{
      this.count = response;
      console.log("count:",response)
    })
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }
}
