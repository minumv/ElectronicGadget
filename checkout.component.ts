import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from 'src/app/Models/Cart';
import { Customer } from 'src/app/Models/Customer';
import { CartService } from 'src/app/Services/cart.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { OrderService } from 'src/app/Services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
  customerId!:string;
  CartProductArray:Cart[]=[];
  customer! : Customer;

  AddressForm! : FormGroup;

  totalItems!:number;
  totalAmount!:number;

  selectedPaymentMethod: string = 'card';

  imageBaseUrl = 'http://localhost:5155';

  constructor(private router:Router, private cartService:CartService,private ordService:OrderService, private custService:CustomerService, private fb:FormBuilder){
    this.AddressForm = this.fb.group({
      address:['']
    })
  }

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    this.GetOrderDetails();
    this.GetCustomerAddress();
    
  }

  GetOrderDetails(){
    this.cartService.GetCartItems(this.customerId).subscribe(res=>{
      this.CartProductArray = res;
      this.calculateTotal();
    })
  }

  calculateTotal() {
    this.totalItems = 0;
    this.totalAmount = 0;
  
    this.CartProductArray.forEach(item => {
      this.totalItems += item.quantity;
      this.totalAmount += item.quantity * item.product.price;
      console.log('quantity', item.quantity );
    });
       
    console.log(this.totalAmount);
  }

  GetCustomerAddress(){
      this.custService.GetCustomerDetail(this.customerId).subscribe(res=>{
          this.customer = res;
          console.log(res);
          
      })
  }

  isValidAddress(address: string | null | undefined): boolean {
    return !!address && address !== 'null' && address.trim() !== '';
  }

  addAddress(){
    console.log("Address ading");
    this.customer.address = this.AddressForm.value.address;
    this.custService.UpdateCustomer(this.customer).subscribe(res=>{
      this.GetCustomerAddress();
    })
  }

  ProceedToPay(){
    console.log('placing order');

    const isCOD = this.selectedPaymentMethod === 'cod' || this.selectedPaymentMethod === 'Cash on Delivery';

    const order = {
      customerId: this.customerId,
      total: this.totalAmount,
      orderStatus: isCOD ? 'Pending' : 'Paid',
      paymentMethod: this.selectedPaymentMethod,
      orderItems: this.CartProductArray.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };
    
    console.log('order:',order);
    this.ordService.CreateOrder(order).subscribe(res => {
      console.log("Order Created:", res);
      this.cartService.RemoveCart(this.customerId).subscribe(res=>{
        this.router.navigate(['/order-success']);
      })
    });
  }
}
