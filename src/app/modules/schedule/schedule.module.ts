import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { GalleryComponent } from '../../components/gallery/gallery.component'

@NgModule({
  declarations: [
    ScheduleComponent,
    GalleryComponent
  ],
  imports: [
    CommonModule,
    
  ]
})
export class ScheduleModule { }
