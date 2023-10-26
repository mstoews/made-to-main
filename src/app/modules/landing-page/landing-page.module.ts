import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { GalleryCardComponent } from '../../components/gallery-card/gallery-card.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { BannerComponent } from './banner/banner.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared-module/shared.module';
import { MadeToServicesModule } from '../made-to-services/made-to-services.module';
import { LightboxModule } from '../lightbox';
import { TailoringComponent } from './tailoring/tailoring.component';
import { ReadyToWearComponent } from './ready-to-wear/ready-to-wear.component';
import { KnittingComponent } from './knitting/knitting.component';
import { RepairsComponent } from './repairs/repairs.component';
import { HighlightComponent } from './highlight/highlight.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactsComponent } from './contacts/contacts.component';
import { MaterialModule } from 'app/material.module';
import { IconsModule } from 'app/icons.module';
import { DataPolicyComponent } from './data-policy/data-policy.component';
import { TosComponent } from './tos/tos.component';
import { LastestBlogComponent } from 'app/components/lastest-blog/lastest-blog.component';
import { ServicesComponent } from './made-to-services/services.component';
import { FollowingComponent } from './following/following.component';
import { TwLighthouseComponent } from 'app/components/tw-lighthouse/tw-lighthouse.component';
import { AboutEntryComponent } from './about-us/about-entry/about-entry.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent,
    data: { state: 'home' },
  },
  {
    path: 'contacts',
    pathMatch: 'full',
    component: ContactsComponent,
    data: { state: 'contacts' },
  },
  {
    path: 'data-policy',
    pathMatch: 'full',
    title: 'Data Policy',
    component: DataPolicyComponent,
    data: { state: 'data-policy' },
  },
  {
    path: 'tailoring',
    pathMatch: 'full',
    title: 'Services Tailoring',
    component: TailoringComponent,
    data: { state: 'tailoring' },
  },
  {
    path: 'ready-to-wear',
    pathMatch: 'full',
    component: ReadyToWearComponent,
    data: { state: 'read-to-wear' },
  },
  {
    path: 'knitting',
    pathMatch: 'full',
    component: KnittingComponent,
    data: { state: 'knitting' },
  },
  {
    path: 'repairs',
    pathMatch: 'full',
    component: RepairsComponent,
    data: { state: 'repairs' },
  },
  {
    path: 'services',
    pathMatch: 'full',
    component: ServicesComponent,
    data: { state: 'services' },
  },
  {
    path: 'following',
    pathMatch: 'full',
    component: FollowingComponent,
    data: { state: 'following' },
  },

  {
    path: 'about_us',
    pathMatch: 'full',
    component: AboutUsComponent,
    data: { state: 'about_us' },
  },
  {
    path: '**',
    pathMatch: 'full',
    component: LandingPageComponent,
  },
];
@NgModule({
  declarations: [
    LandingPageComponent,
    BannerComponent,
    GalleryComponent,
    TailoringComponent,
    ReadyToWearComponent,
    KnittingComponent,
    RepairsComponent,
    HighlightComponent,
    AboutUsComponent,
    ContactsComponent,
    DataPolicyComponent,
    TosComponent,
    ServicesComponent,
    FollowingComponent,
    AboutEntryComponent],

  imports: [
    CommonModule,
    GalleryCardComponent,
    SharedModule,
    MadeToServicesModule,
    LightboxModule,
    RouterModule.forChild(routes),
    NgOptimizedImage,
    MaterialModule,
    IconsModule,
    LastestBlogComponent,
    TwLighthouseComponent,
    AboutEntryComponent,
  ],
})
export class LandingPageModule {}
