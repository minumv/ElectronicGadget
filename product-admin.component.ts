import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { Product } from '../../Models/Product';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css']
})
export class ProductAdminComponent implements OnInit{
  ProductsArray : Product [] = [];
  imageBaseUrl = 'http://localhost:5155';
  constructor(private pdtService:ProductService){}

  title = "Product Details";
  ngOnInit(): void {
    this.getProductList();
  }

  getProductList(){
    this.pdtService.GetProducts().subscribe(response=>{
      this.ProductsArray=response;
      console.log(this.ProductsArray);
      
    })
  }
}
