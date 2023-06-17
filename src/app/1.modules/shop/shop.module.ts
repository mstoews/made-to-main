import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ShopComponent } from './main.component';
import { Routes, RouterModule } from '@angular/router';
import { MainShopComponent } from './main-shop/shop.component';
import { ShopCardComponent } from './shop-card/shop-card.component';
import { MaterialModule } from 'app/material.module';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from '../shared-module/shared.module';
import { CartComponent } from './cart/cart.component';
import { ProductDetailsFiveComponent } from './shop-product/product-details-five.component';
import { ProductResolver } from 'app/4.services/product.resolver';
import { SafePipe } from './safe.pipe';
import { StripeCheckoutComponent } from './stripe-checkout/stripe-checkout.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { WishListComponent } from './wishlist/wishlist.component';
import { CartResolver } from 'app/4.services/cart.resolver';
import { WishListResolver } from 'app/4.services/wishlist.resolver';
import { NotificationComponent } from 'app/3.components/notification/notification.component';
import { PurchaseThanksComponent } from './thanks/purchase-thanks';
import { CheckoutComponent } from './checkout.component';
import { AddressComponent } from '../pages/profile/address/address.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { WishlistCardComponent } from './wishlist/wishlist-card/wishlist-card.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Shopping',
    component: MainShopComponent,
  },
  {
    path: 'product/:id',
    title: 'Shopping Items',
    component: ProductDetailsFiveComponent,
    resolve: {
      product: ProductResolver,
    },
    data: { state: 'product/:id' },
  },
  {
    path: 'cart/:id',
    title: 'Shopping Cart',
    component: CartComponent,
    resolve: { cart: CartResolver },
    data: { state: 'cart/:id' },
  },
  {
    path: 'wishlist/:id',
    pathMatch: 'full',
    title: 'Wish List',
    component: WishListComponent,
    resolve: {
      wishlist: WishListResolver,
    },
    data: { state: 'wishlist/:id' },
  },

  {
    path: 'stripe-checkout',
    pathMatch: 'full',
    title: 'Stripe Checkout',
    component: StripeCheckoutComponent,
    data: { state: 'stripe-checkout' },
  },
  {
    path: 'coming-soon',
    pathMatch: 'full',
    title: 'Coming in January',
    component: ComingSoonComponent,
    data: { state: 'coming-soon' },
  },
  {
    path: 'purchase-thanks',
    pathMatch: 'full',
    title: 'Purchases',
    component: PurchaseThanksComponent,
    data: { state: 'purchase-thanks' },
  },
  {
    path: 'checkout',
    pathMatch: 'full',
    title: 'Checkout',
    component: CheckoutComponent,
    data: { state: 'checkout' },
  },
];

@NgModule({
  declarations: [
    ShopComponent,
    MainShopComponent,
    CartComponent,
    ShopCardComponent,
    ProductDetailsFiveComponent,
    StripeCheckoutComponent,
    SafePipe,
    ComingSoonComponent,
    WishListComponent,
    PurchaseThanksComponent,
    CheckoutComponent,
    PaymentConfirmationComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    MaterialModule,
    FuseCardModule,
    SharedModule,
    NotificationComponent,
    RouterModule.forChild(routes),
    AddressComponent,
    NgxSpinnerModule,
    WishlistCardComponent,
  ],
})
export class ShopModule {}
