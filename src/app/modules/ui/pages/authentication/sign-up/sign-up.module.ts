import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'app/modules/shared-module/shared.module';
import { SignUpClassicComponent } from './classic/sign-up.component';

const routes: Routes = [
  {
    path: 'sign-up',
    children: [
      {
        path: '',
        component: SignUpClassicComponent,
      },
      {
        path: '**',
        redirectTo: '/home',
      },
    ],
  },
];

const components = [SignUpClassicComponent];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],
  exports: [...components],
})
export class SignUpModule {}
