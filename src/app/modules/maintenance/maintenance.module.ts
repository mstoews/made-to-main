import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesComponent } from './images/images.component';
import { CollectionsComponent } from './collections/collections.component';
import { MaterialModule } from 'app/material.module';

import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
} from 'devextreme-angular';
import { RouterModule, Routes } from '@angular/router';
import { ImagesMenubarComponent } from './grid-menubar/image-menubar.component';
import { DndComponent } from 'app/components/loaddnd/dnd.component';

const routes: Routes = [
  {
    path: 'images',
    pathMatch: 'full',
    component: ImagesComponent,
  },
  {
    path: 'collections',
    pathMatch: 'full',
    component: CollectionsComponent,
  },

  {
    path: '**',
    pathMatch: 'full',
    component: ImagesComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: ImagesComponent,
  },
];

@NgModule({
  declarations: [CollectionsComponent, ImagesComponent, ImagesMenubarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule,
    DndComponent,
  ],
})
export class MaintenanceModule {}
