import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from 'src/app/Models/Cart';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  customerId!:string;
  CartProductArray : Cart [] = [];

  totalItems!:number;
  totalAmount!:number;

  imageBaseUrl = 'http://localhost:5155';

  constructor( private cartService : CartService, private router:Router){}

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    this.GetCustomerCart();
  }

  GetCustomerCart(){
    this.cartService.GetCartItems(this.customerId).subscribe({
      next:(response)=>{
        this.CartProductArray = response;
        console.log(this.CartProductArray);
        this.calculateTotal();
      },
      error: (err)=>{
        console.error('Error loading cart items:', err);
      }     
    })
  }

  CartIncrement(productid:string){
      console.log("increment");
      this.cartService.IncrementCartItem(this.customerId,productid).subscribe(response=>{
          this.GetCustomerCart();
      })
  }

  CartDecrement(productid:string){
    console.log("decrement");
      this.cartService.DecrementCartItem(this.customerId,productid).subscribe(response=>{
        this.GetCustomerCart();
      })
  }

  RemoveItem( productid:string ){
      this.cartService.RemoveCartItem(this.customerId,productid).subscribe(response=>{
        this.GetCustomerCart();
      })
  }
  
  RemoveCart(){
      this.cartService.RemoveCart(this.customerId).subscribe(response=>{
        this.GetCustomerCart();
      })
  }

  calculateTotal() {
    this.totalItems = 0;
    this.totalAmount = 0;
  
    this.CartProductArray.forEach(item => {
      this.totalItems += item.quantity;
      this.totalAmount += item.quantity * item.product.price;
    });
  }

}
