import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MaterialModule } from 'app/material.module';
import { BlogResolver } from 'app/4.services/blog.resolver';
import { DxHtmlEditorModule } from 'devextreme-angular';
// import { FuseCardModule } from '@fuse/components/card';
import { IconsModule } from 'app/icons.module';
import { BlogEditRoutingModule } from './blog-routing.module';
import { BlogAdminComponent } from './blog-grid.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { SafePipe } from './safe.pipe';
import { BlogAddDialog } from './add/blog-add.component';
import { BlogImageSelectionComponent } from './blog-image-selection/blog-image-selection.component';
import { SharedModule } from '../shared-module/shared.module';

@NgModule({
  declarations: [
    BlogEditComponent,
    BlogAdminComponent,
    BlogImageSelectionComponent,
    BlogAddDialog,
    SafePipe,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DxHtmlEditorModule,
    NgOptimizedImage,
    SharedModule,
    //  FuseCardModule,
    IconsModule,
    BlogEditRoutingModule,
  ],
  providers: [BlogResolver],
})
export class BlogAdminModule {}