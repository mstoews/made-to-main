import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { BannerComponent } from './banner/banner.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

import { CarouselComponent } from './carousel/carousel.component';
import { MaterialModule } from 'app/material.module';

import { SharedModule } from '../shared-module/shared.module';
import { SafePipe } from './safe.pipe';

const routes: Routes = [
  {
    path: '',
    component: CarouselComponent,
  },
];

@NgModule({
  declarations: [
    SafePipe,
    BannerComponent,
    OrderSummaryComponent,
    CarouselComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    SharedModule,
    NgOptimizedImage,
  ],
})
export class ProductsModule {}
