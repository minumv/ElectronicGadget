import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/Models/Order';
import { OrderService } from 'src/app/Services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  //OrderArray:Order[] = [];

 constructor( private odrService : OrderService){}
 ngOnInit(): void {
   this.GetAllOrder();
 }

 GetAllOrder(){
    this.odrService.GetAllOrder().subscribe(res=>{
      console.log(res);
      //this.OrderArray = res;
    })
 }
}
