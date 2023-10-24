import { NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { SharedModule } from './modules/shared-module/shared.module';
import { ScrollService } from './services/scroll.service';

import { ProductResolver } from './services/product.resolver';
import { BlogResolver, CalendarResolver } from './services/blog.resolver';


// Firebase services + environment module

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  provideAuth,
  getAuth,
  connectAuthEmulator,
  AuthModule,
} from '@angular/fire/auth';
import {
  provideFirestore,
  getFirestore,
  connectFirestoreEmulator,
} from '@angular/fire/firestore';
import {
  provideStorage,
  getStorage,
  connectStorageEmulator,
} from '@angular/fire/storage';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { providePerformance, getPerformance } from '@angular/fire/performance';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { CartResolver } from './services/cart.resolver';
import { WishListResolver } from './services/wishlist.resolver';
import { environment } from '../environments/environment.prod';
import { HeadingModule } from './main/header/heading.module';
import { UserService } from './services/auth/user.service';
import { CookieBannerComponent } from './cookie-banner/cookie-banner.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';

@NgModule({
  declarations: [AppComponent, CookieBannerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
    HeadingModule,
    provideFunctions(() => getFunctions()),
    providePerformance(() => getPerformance()),
    provideAnalytics(() => getAnalytics()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      }
      return auth;
    }),

    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8086);
      }
      return firestore;
    }),

    provideStorage(() => {
      const storage = getStorage();
      if (environment.useEmulators) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    }),

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideMessaging(() => getMessaging()),
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
