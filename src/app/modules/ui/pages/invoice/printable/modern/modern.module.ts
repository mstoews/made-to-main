import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModernComponent } from './modern.component';
import { modernRoutes } from './modern.routing';

@NgModule({
    declarations: [
        ModernComponent
    ],
    imports     : [
        RouterModule.forChild(modernRoutes)
    ]
})
export class ModernModule
{
}
