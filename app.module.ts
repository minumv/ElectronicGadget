import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ProductComponent } from './User/product/product.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './User/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from  '@angular/common/http'
import { AuthInterceptor } from './Interceptor/auth.interceptor';
import { HeaderComponent } from './User/header/header.component';
import { CartComponent } from './User/cart/cart.component';
import { ProfileComponent } from './User/profile/profile.component';
import { CheckoutComponent } from './User/checkout/checkout.component';
import { SuccessComponent } from './User/success/success.component';
import { TemporaryComponent } from './temporary/temporary.component';
import { ChatComponent } from './chat/chat.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,   
    ProductComponent, HeaderComponent, CartComponent, ProfileComponent, CheckoutComponent, SuccessComponent, TemporaryComponent, ChatComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
