import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './User/home/home.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { ProductComponent } from './User/product/product.component';
import { ProfileComponent } from './User/profile/profile.component';
import { CartComponent } from './User/cart/cart.component';
import { CheckoutComponent } from './User/checkout/checkout.component';
import { SuccessComponent } from './User/success/success.component';
import { roleGuard } from './auth/role.guard';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadChildren: () => import('./Admin/dashboard/dashboard.module').then(m => m.DashboardModule),
  },

  { path:'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent},
  { path: 'chat', component:ChatComponent},
  { path: 'dashboard', component: DashboardComponent,canActivate: [roleGuard], data: { expectedRole: 'Admin' }},
  { path: 'products', component: ProductComponent, canActivate: [roleGuard], data: { expectedRole: 'Customer' }},
  { path: 'profile', component: ProfileComponent, canActivate: [roleGuard], data: { expectedRole: 'Customer' }},
  { path: 'cart', component:CartComponent, canActivate: [roleGuard], data: { expectedRole: 'Customer' }},
  { path: 'checkout', component:CheckoutComponent, canActivate: [roleGuard], data: { expectedRole: 'Customer' }},
  { path: 'order-success', component:SuccessComponent, canActivate: [roleGuard], data: { expectedRole: 'Customer' }}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
