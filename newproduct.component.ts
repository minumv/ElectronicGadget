import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../Services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newproduct',
  templateUrl: './newproduct.component.html',
  styleUrls: ['./newproduct.component.css']
})
export class NewproductComponent {

  ProductFormGroup! : FormGroup;
  selectedImage! : File;

  constructor(private fb:FormBuilder, private pdtService:ProductService, private router : Router){
    this.ProductFormGroup = this.fb.group({
        id : [''],
        productName : [''],
        price : [''],
        stock : [''],
        description : [''],
        productImage:['']
    })
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  OnSubmit(){
    const formData = new FormData();
    formData.append('productName', this.ProductFormGroup.get('productName')?.value);
    formData.append('price', this.ProductFormGroup.get('price')?.value);
    formData.append('stock', this.ProductFormGroup.get('stock')?.value);
    formData.append('description', this.ProductFormGroup.get('description')?.value);
    if (this.selectedImage) {
      formData.append('productImage', this.selectedImage);
    }
  
    // Send this formData to backend via a service
    this.pdtService.CreateProduct(formData).subscribe(res => {
      console.log('Product created:', res);
     this.router.navigate(['/dashboard/products']);
    });
  }
}
