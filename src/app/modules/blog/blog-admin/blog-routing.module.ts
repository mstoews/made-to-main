import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogResolver } from 'app/services/blog.resolver';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { BlogAdminComponent } from './blog-grid.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Thoughts',
    component: BlogAdminComponent,
    data: { state: 'blog-admin' },
  },
  {
    path: 'blog-admin/:id',
    title: 'Thoughts',
    component: BlogEditComponent,
    resolve: {
      blog: BlogResolver,
    },
    data: { state: 'blog-admin/:id' },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BlogEditRoutingModule],
})
export class BlogEditRoutingModule {}
