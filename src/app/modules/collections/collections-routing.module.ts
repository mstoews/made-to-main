import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionResolver } from 'app/services/collection.resolver';
import { CollectionsEditComponent } from './collection-edit/collections-edit.component';
import { CollectionsAdminComponent } from './collection-grid/collections-grid.component';
import { CollectionPage } from './collection-page/collection-page/collection-page.component';
import { CollectionMainComponent } from './collection-page/collection-main.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CollectionsAdminComponent,
    data: { state: 'collections-admin' },
    title: 'Collections',
  },
  {
    path: 'item/:id',
    title: 'Collections Item',
    component: CollectionsEditComponent,
    resolve: {
      collection: CollectionResolver,
    },
    data: { state: 'item/:id' },
  },
  {
    path: 'collections',
    component: CollectionPage,
    title: 'Collections',
    data: { state: 'collections' },
  },
  {
    path: 'collection/:id',
    component: CollectionMainComponent,
    resolve: {
      collection: CollectionResolver,
    },
    title: 'Collections',
    data: { state: 'collections' },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CollectionsEditRoutingModule],
})
export class CollectionsEditRoutingModule {}
