import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from 'app/modules/shared-module/shared.module';
import { ResetPasswordClassicComponent } from './classic/reset-password.component';

const routes: Routes = [
  {
    path: 'reset-password',
    children: [
      {
        path: 'classic',
        component: ResetPasswordClassicComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [ResetPasswordClassicComponent],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],
})
export class ResetPasswordModule {}
