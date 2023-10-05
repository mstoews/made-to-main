import { NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { SharedModule } from './1.modules/shared-module/shared.module';
import { ScrollService } from './4.services/scroll.service';
import { SwiperModule } from 'swiper/angular';
import { ProductResolver } from './4.services/product.resolver';
import { BlogResolver, CalendarResolver } from './4.services/blog.resolver';
import "firebase/compat/performance";


// Firebase services + environment module
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/compat/auth';
import {
  AngularFirestoreModule,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
} from '@angular/fire/compat/firestore';
import {
  AngularFireFunctionsModule,
  USE_EMULATOR as USE_FUNCTIONS_EMULATOR,
} from '@angular/fire/compat/functions';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './4.services/auth/auth.interceptor';
import { CartResolver } from './4.services/cart.resolver';
import { WishListResolver } from './4.services/wishlist.resolver';
import { environment } from '../environments/environment.prod';
import { HeadingModule } from './2.main/header/heading.module';
import { UserService } from './4.services/auth/user.service';
import { CookieBannerComponent } from './cookie-banner/cookie-banner.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent, CookieBannerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
    SwiperModule,
    HeadingModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    ScrollService,
    ProductResolver,
    CartResolver,
    WishListResolver,
    BlogResolver,
    CalendarResolver,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: 'window',
      useValue: window,
    },
    {
      provide: 'document',
      useValue: document,
    },
    { provide: 'googleTagManagerId', useValue: environment.gtm_id },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
