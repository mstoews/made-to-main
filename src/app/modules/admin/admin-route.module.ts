import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { ProductResolver } from 'app/services/product.resolver';
import { AdminFormComponent } from './company/admin-form/admin-form.component';
import { AdminShellComponent } from './company/admin-shell/admin-shell.component';
import { CategoryGridComponent } from './category-grid/category-grid.component';

import { InventoryComponent } from '../shop/shop-inventory-maintenance/inventory-grid.component';
import { InventoryImageSelectionComponent } from '../shop/shop-inventory-maintenance/inventory-image-selection/inventory-image-selection.component';
import { ProductEditComponent } from '../shop/shop-inventory-maintenance/product-edit/product-edit.component';

import { ContactListComponent } from './contact-list/contact-list.component';
import {
  AuthGuard,
  hasCustomClaim,
  canActivate,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { ImageMgtEditComponent } from './image-maintenance/image-edit/image-mgt-edit.component';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['authentication/split-screen/sign-in']);
// const redirectLoggedInToHome = () => redirectUnauthorizedTo(['home']);
const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'company',
    pathMatch: 'full',
    title: 'Administration',
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
    component: AdminFormComponent,
  },
  {
    path: 'inventory',
    title: 'Product Maintenance',
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
    component: InventoryComponent,
  },
  {
    path: 'inventory/:id',
    title: 'Product Edit',
    component: ProductEditComponent,
    resolve: {
      product: ProductResolver,
    },
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: 'category',
    title: 'Category Maintenance',
    component: CategoryGridComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
  },

  {
    path: 'inventory-selection',
    pathMatch: 'full',
    component: InventoryImageSelectionComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: 'image-maintenance',
    pathMatch: 'full',
    component: ImageMgtEditComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: 'contact-grid',
    pathMatch: 'full',
    component: ContactListComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AdminRouteModule],
})
export class AdminRouteModule {}
