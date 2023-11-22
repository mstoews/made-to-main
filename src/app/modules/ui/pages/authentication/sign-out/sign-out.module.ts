import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'app/modules/shared-module/shared.module';
import { SignOutClassicComponent } from './classic/sign-out.component';
import { SignOutFullscreenComponent } from './fullscreen/sign-out.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'sign-out',
    children: [
      {
        path: 'classic',
        component: SignOutClassicComponent,
      },
      {
        path: 'fullscreen',
        component: SignOutFullscreenComponent,
      },
    ],
  },
];

const components = [SignOutFullscreenComponent, SignOutClassicComponent];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    FormsModule,
  ],
  exports: [...components],
})
export class SignOutModule {}
