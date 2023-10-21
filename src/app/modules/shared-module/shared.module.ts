import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';

import { IconsModule } from 'app/icons.module';
import { FooterComponent } from 'app/components/footer/footer.component';
import { MenubarComponent } from 'app/components/menubar/menubar.component';
import { SideNavComponent } from 'app/main/sidenav/sidenav.component';
import { ShellComponent } from 'app/main/shell.component';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { HeadingModule } from 'app/main/header/heading.module';

const components = [
  MenubarComponent,
  FooterComponent,
  SideNavComponent,
  ShellComponent,
];

const modules = [
  CommonModule,
  RouterModule,
  MaterialModule,
  IconsModule,
  NotificationComponent,
  HeadingModule,
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...modules, components],
})
export class SharedModule {}
