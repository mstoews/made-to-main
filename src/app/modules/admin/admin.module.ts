import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AdminComponent } from './company/admin.component';
import { MaterialModule } from 'app/material.module';
import { GridMenubarComponent } from './grid-menubar/grid-menubar.component';
import { GalleryLightboxModule } from '../gallery-lightbox/gallery-lighthouse.module';
import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  DxPopupModule,
} from 'devextreme-angular';
import { CategoryGridComponent } from './category-grid/category-grid.component';
import { InventoryComponent } from '../shop/shop-inventory-maintenance/inventory-grid.component';
import { AdminFormComponent } from './company/admin-form/admin-form.component';
import { DxHtmlEditorModule } from 'devextreme-angular';
import { GalleryComponent } from './gallery/gallery.component';
import { SafePipe } from './safe.pipe';
import { IconsModule } from 'app/icons.module';
import { ProductEditComponent } from '../shop/shop-inventory-maintenance/product-edit/product-edit.component';
import { AdminShellComponent } from './company/admin-shell/admin-shell.component';
import { BlogResolver } from 'app/services/blog.resolver';

import { AdminRouteModule } from './admin-route.module';
import { ProductResolver } from 'app/services/product.resolver';
import { AddComponentDialog } from '../shop/shop-inventory-maintenance/add/add.component';
import { InventoryPreviewComponent } from '../shop/shop-inventory-maintenance/inventory-preview/inventory-preview.component';

import { ImageListComponent } from './image-list/image-list.component';
import { SharedModule } from '../shared-module/shared.module';
import { PolicyModule } from '../policy/policy.module';
import { ContactListComponent } from './contact-list/contact-list.component';
import { InventoryImageCardComponent } from '../shop/shop-inventory-maintenance/inventory-image-card/inventory-image-card.component';
import { ViewImageItemComponent } from '../shop/shop-inventory-maintenance/inventory-image-card/view-image-item/view-image-item.component';
import { HeadingModule } from 'app/main/header/heading.module';
import { ImageMaintenanceModule } from './image-maintenance/image-maintenance.module';
import { ConfirmCategoryDialog } from './category-grid/add/add.component';
//import { PurchaseComponent } from './purchases/purchase-grid.component';
//import { PurchaseDetailComponent } from './purchases/purchase-detail/purchase-detail.component';

@NgModule({
  declarations: [
    AdminComponent,
    GridMenubarComponent,
    CategoryGridComponent,
    InventoryComponent,
    AdminFormComponent,
    GalleryComponent,
    SafePipe,
    InventoryComponent,
    ProductEditComponent,
    AdminShellComponent,
    AddComponentDialog,
    InventoryPreviewComponent,
    ImageListComponent,
    ContactListComponent,
    InventoryImageCardComponent,
    ConfirmCategoryDialog,
  //  PurchaseComponent,
  //  PurchaseDetailComponent
  ],
  imports: [
    AdminRouteModule,
    CommonModule,
    MaterialModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule,
    AdminRouteModule,
    GalleryLightboxModule,
    DxPopupModule,
    DxHtmlEditorModule,
    NgOptimizedImage,
    IconsModule,
    SharedModule,
    PolicyModule,
    ViewImageItemComponent,
    HeadingModule,
    ImageMaintenanceModule,
  ],
  exports: [AdminComponent],
  providers: [BlogResolver, ProductResolver],
})
export class AdminModule {}
