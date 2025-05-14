import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/Models/Product';
import { Cart } from 'src/app/Models/Cart';
import { ProductService } from 'src/app/Services/product.service';
import { CartService } from 'src/app/Services/cart.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  customerId!: string;
  ProductsArray : Product[] = [];
  ProductFormGroup : FormGroup;
  imageBaseUrl = 'http://localhost:5155';
  constructor(private router:Router,private fb: FormBuilder, private pdtService : ProductService, private cartservice : CartService){
    this.ProductFormGroup = this.fb.group({

    })
  }

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    this.getProducts();
  }

  getProducts(){
    this.pdtService.GetProducts().subscribe(response=>{
      this.ProductsArray = response;
      console.log(this.ProductsArray);      
    })
  }

  OnSubmit(pdtid:string){
    console.log("submitting cart: "+this.customerId+ ' ...'+pdtid);
    this.cartservice.AddProductToCart(this.customerId,pdtid).subscribe(response=>{
      console.log(response);
      this.router.navigate(['/cart']);
    })
  }
}
