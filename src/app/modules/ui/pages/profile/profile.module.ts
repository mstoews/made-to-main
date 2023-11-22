import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { profileRoutes } from './profile.routing';
import { HeadingModule } from 'app/main/header/heading.module';
import { AddressComponent } from './address/address.component';
import { MaterialModule } from 'app/material.module';
import { SignOutModule } from '../authentication/sign-out/sign-out.module';
import { SharedModule } from 'app/modules/shared-module/shared.module';
import { SignInModule } from '../authentication/sign-in/sign-in.module';
import { SignUpModule } from '../authentication/sign-up/sign-up.module';
import { CaraselComponent } from './carasel/carasel.component';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { TableRowComponent } from './table-row/table-row.component';
import { SetAdminComponent } from './set-admin/set-admin.component';

@NgModule({
  declarations: [
    ProfileComponent,
    CaraselComponent,
    ProfileListComponent,
    TableRowComponent,
    SetAdminComponent,
  ],
  imports: [
    RouterModule.forChild(profileRoutes),
    MaterialModule,
    SharedModule,
    AddressComponent,
    SignOutModule,
    HeadingModule,
    SignInModule,
    SignUpModule,
    SignOutModule,
  ],

  exports: [ProfileComponent],
})
export class ProfileModule {}
