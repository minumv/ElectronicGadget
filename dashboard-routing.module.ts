import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CustomerComponent } from '../customer/customer.component';
import { OrderComponent } from '../order/order.component';
import { CustomerHandleComponent } from '../customer-handle/customer-handle.component';
import { ProductAdminComponent } from '../product-admin/product-admin.component';
import { NewproductComponent } from '../newproduct/newproduct.component';
import { ProducteditComponent } from '../productedit/productedit.component';
import { roleGuard } from 'src/app/auth/role.guard';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: 'customers', component: CustomerComponent , canActivate: [roleGuard], data: { expectedRole: 'Admin' }},
      { path: 'products', component: ProductAdminComponent , canActivate: [roleGuard], data: { expectedRole: 'Admin' } },
      { path: 'orders', component: OrderComponent, canActivate: [roleGuard], data: { expectedRole: 'Admin' } },
      { path: 'customeredit/:id', component: CustomerHandleComponent, canActivate: [roleGuard], data: { expectedRole: 'Admin' }},
      { path: 'newproduct', component: NewproductComponent, canActivate: [roleGuard], data: { expectedRole: 'Admin' }},
      { path: 'productedit/:id', component: ProducteditComponent, canActivate: [roleGuard], data: { expectedRole: 'Admin' }}
    //   { path: '', redirectTo: 'customers', pathMatch: 'full' }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}