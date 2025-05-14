import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CustomerComponent } from '../customer/customer.component';

import { OrderComponent } from '../order/order.component';
import { CustomerHandleComponent } from '../customer-handle/customer-handle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from  '@angular/common/http'
import { ProductAdminComponent } from '../product-admin/product-admin.component';
import { NewproductComponent } from '../newproduct/newproduct.component';
import { ProducteditComponent } from '../productedit/productedit.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CustomerComponent,
    ProductAdminComponent,
    OrderComponent,
    CustomerHandleComponent, 
    NewproductComponent,
    ProducteditComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class DashboardModule { }