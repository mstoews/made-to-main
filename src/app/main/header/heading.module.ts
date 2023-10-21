import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { LandingHeaderComponent } from './landing-header/landing.header.component';
import { MaterialModule } from 'app/material.module';

const components = [
  HeaderComponent,
  LandingHeaderComponent,
];

const modules = [
  CommonModule,
  MaterialModule,
]

@NgModule({
  declarations: [  ...components ],
  imports: [ ...modules
  ],
  exports: [...modules, ...components],
})
export class HeadingModule { }
