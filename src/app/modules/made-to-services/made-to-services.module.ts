import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceDescriptionComponent } from './service-description/service-description.component';
import { Routes, RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ServiceDescriptionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ServiceDescriptionComponent
  ]
})
export class MadeToServicesModule { }
