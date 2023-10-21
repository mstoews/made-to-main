import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MaterialModule } from 'app/material.module';
import { BlogResolver } from 'app/services/blog.resolver';
import { DxDataGridModule, DxHtmlEditorModule } from 'devextreme-angular';
import { BlogEditRoutingModule } from './blog-routing.module';
import { BlogAdminComponent } from './blog-grid.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { SafePipe } from './safe.pipe';
import { BlogAddDialog } from './add/blog-add.component';
import { BlogImageSelectionComponent } from './blog-image-selection/blog-image-selection.component';
import { SharedModule } from '../../shared-module/shared.module';
import { BlogPreviewComponent } from './blog-preview/blog-preview.component';

@NgModule({
  declarations: [
    BlogEditComponent,
    BlogAdminComponent,
    BlogImageSelectionComponent,
    BlogAddDialog,
    SafePipe,
    BlogPreviewComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DxHtmlEditorModule,
    DxDataGridModule,
    NgOptimizedImage,
    SharedModule,

    BlogEditRoutingModule,
  ],
  providers: [BlogResolver],
  exports: [BlogEditComponent, BlogAdminComponent],
})
export class BlogAdminModule {}
