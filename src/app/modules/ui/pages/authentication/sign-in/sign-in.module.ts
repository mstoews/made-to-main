import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/modules/shared-module/shared.module';
import { SignInClassicComponent } from './classic/sign-in.component';

const routes: Routes = [
  {
    path: 'sign-in',
    children: [
      {
        path: 'classic',
        component: SignInClassicComponent,
        data: { state: 'classic' },
      },
    ],
  },
];

const components = [SignInClassicComponent];

const modules = [RouterModule.forChild(routes), SharedModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components],
})
export class SignInModule {}
