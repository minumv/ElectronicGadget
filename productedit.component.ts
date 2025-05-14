import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../Models/Product';

@Component({
  selector: 'app-productedit',
  templateUrl: './productedit.component.html',
  styleUrls: ['./productedit.component.css']
})
export class ProducteditComponent {

  ProductId! : string;
  ProductFormGroup! : FormGroup;
  selectedImage! : File;
  previewImage: string | null = null;
  imageBaseUrl = 'http://localhost:5155';

  constructor(private pdtService:ProductService, private fb:FormBuilder, private router:Router, private route:ActivatedRoute){
    this.ProductFormGroup = this.fb.group({
      id : [''],
      productName : [''],
      price : [''],
      stock : [''],
      description : [''],
    //  productImagePath:['']
    })
  }

  ngOnInit(): void {
      this.ProductId = this.route.snapshot.paramMap.get('id')!;
      console.log(this.ProductId);
      this.getProductDetails();
    }

    onImageSelected(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.selectedImage = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImage = e.target.result; // base64 preview URL
        };
        reader.readAsDataURL(this.selectedImage); // 🔥 generates preview
      }
      
    }
  
    getProductDetails(){
      this.pdtService.GetProductDetail(this.ProductId).subscribe(response=>{
        console.log(response);
       // this.customer = response;
        this.FillForm(response);
        
      })
    }
  
    OnSubmit(){
      const formData = new FormData();

        // Append form values
        formData.append('productName', this.ProductFormGroup.get('productName')?.value);
        formData.append('price', this.ProductFormGroup.get('price')?.value);
        formData.append('stock', this.ProductFormGroup.get('stock')?.value);
        formData.append('description', this.ProductFormGroup.get('description')?.value);

        // Append image only if changed
        if (this.selectedImage) {
          formData.append('productImage', this.selectedImage);
        }

        const productId = this.ProductFormGroup.get('id')?.value;

        // Send the request with FormData and ID
        this.pdtService.UpdateProduct(productId, formData).subscribe(response => {
          console.log("Product updated successfully");
          this.router.navigate(['/dashboard/products']);
        });
    }
  
    FillForm(pdt:Product){
      this.ProductFormGroup.setValue({          
        id: pdt.id,
        productName: pdt.productName,
        price: pdt.price,
        stock: pdt.stock,
        description: pdt.description   
        
      })
      this.previewImage = this.imageBaseUrl + pdt.productImagePath;
    }
  
    confirmDelete() {
      const confirmed = window.confirm("Are you sure you want to delete this product?");
      if (confirmed) {
        this.DeleteProduct(this.ProductId);
        this.router.navigate(['/dashboard/products']);
      }
    }
  
    DeleteProduct(id:string){    
        this.pdtService.RemoveProduct(id).subscribe(response=>{
          console.log(response);
          
        })
      }
}
