import { Injectable, NgModule, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ShopComponent } from './main.component';
import {
  Routes,
  RouterModule,
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
  Resolve,
} from '@angular/router';
import { MainShopComponent } from './shop/main-shop/shop.component';
import { ShopCardComponent } from './shop/main-shop/shop-card/shop-card.component';
import { MaterialModule } from 'app/material.module';

import { SharedModule } from '../shared-module/shared.module';
import { CartComponent } from './shop/cart/cart.component';
import { ProductDetailsFiveComponent } from './shop/shop-product/product-details-five.component';
import { ProductResolver } from 'app/services/product.resolver';
import { SafePipe } from './safe.pipe';
import { StripeCheckoutComponent } from './shop/stripe-checkout/stripe-checkout.component';
import { ComingSoonComponent } from './shop/coming-soon/coming-soon.component';
import { WishListComponent } from './shop/wishlist/wishlist.component';
import { CartResolver } from 'app/services/cart.resolver';
import { WishListResolver } from 'app/services/wishlist.resolver';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { PurchaseThanksComponent } from './shop/thanks/purchase-thanks';
import { CheckoutComponent } from './shop/checkout.component';
import { AddressComponent } from 'app/modules/ui/pages/profile/address/address.component';
import { PaymentConfirmationComponent } from './shop/payment-confirmation/payment-confirmation.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { WishlistCardComponent } from './shop/wishlist/wishlist-card/wishlist-card.component';
import { ShopLandingComponent } from './shop/shop-landing/shop-landing.component';
import { ShopLandingCardComponent } from './shop/shop-landing/shop-landing-card/shop-landing-card.component';
import { Product } from 'app/models/products';
import { ProductsService } from 'app/services/products.service';
import { ShopCategoryCardComponent } from './shop/main-shop/shop-category-card/shop-category-card.component';
import { LightboxModule } from '../lightbox';
import { StripHtmlPipe } from './striphtml.pipe';
import { ElementsComponent } from './shop/cart/elements/elements.component';


export const ProductFuncResolver: ResolveFn<Product[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(ProductsService).getInventoryByCategory(
    route.paramMap.get('id')
  );
};

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Shop Landing',
    component: ShopLandingComponent,
    data: { state: 'shop-landing' },
  },
  {
    path: 'shop',
    pathMatch: 'full',
    title: 'Shopping',
    component: MainShopComponent,
  },
  {
    path: 'category/:id',
    pathMatch: 'full',
    title: 'Shopping',
    component: MainShopComponent,
    // resolve: {
    //   shop: ProductFuncResolver,
    // },
    data: { state: 'category/:id' },
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
    WishlistCardComponent,
    ShopLandingComponent,
    ShopLandingCardComponent,
    ShopCategoryCardComponent,
    ElementsComponent,
    StripHtmlPipe,

  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    MaterialModule,
    SharedModule,
    NotificationComponent,
    RouterModule.forChild(routes),
    AddressComponent,
    NgxSpinnerModule,
    LightboxModule,
  ],
})
export class ShopModule {}
