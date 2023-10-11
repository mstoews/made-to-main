import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import {
  AuthGuard,
  hasCustomClaim,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['authentication/split-screen/sign-in']);
const redirectLoggedInToHome = () => redirectUnauthorizedTo(['home']);
const adminOnly = () => hasCustomClaim('admin');

const routes: Route[] = [
  {
    path: 'home',
    loadChildren: () =>
      import('./1.modules/landing-page/landing-page.module').then(
        (mod) => mod.LandingPageModule
      ),
    data: { state: 'home' },
    title: 'Made To',
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./1.modules/ui/pages/authentication/authentication.module').then(
        (mod) => mod.AuthenticationModule
      ),
    data: { state: 'authenication' },
    title: 'Login',
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./1.modules/shop/shop.module').then((mod) => mod.ShopModule),
    data: { state: 'shop' },
    title: 'Shop',
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./1.modules/blog/blog.module').then(
        (mod) => mod.MadeToBlogModule
      ),
    data: { state: 'blog' },
    title: 'Thoughts',
  },
  {
    path: 'image-admin',
    loadChildren: () =>
      import(
        './1.modules/admin/image-maintenance/image-maintenance.module'
      ).then((mod) => mod.ImageMaintenanceModule),
    title: 'Image Maintenance',
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
  },

  {
    path: 'blog-admin',
    loadChildren: () =>
      import('./1.modules/blog/blog-admin/blog-admin.module').then(
        (mod) => mod.BlogAdminModule
      ),
    title: 'Blog Admin',
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
  },

  {
    path: 'collections-admin',
    loadChildren: () =>
      import('./1.modules/collections/collections-admin.module').then(
        (mod) => mod.CollectionsAdminModule
      ),
    title: 'Collection Admin',
    canActivate: [AuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./1.modules/admin/admin.module').then((mod) => mod.AdminModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
    title: 'Maintenance',
  },
  {
    path: 'collections-admin/collection',
    loadChildren: () =>
    import('./1.modules/collections/collections-admin.module').then(
      (mod) => mod.CollectionsAdminModule
    ),
    data: { state: 'collections' },
    title: 'Featured',
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./1.modules/ui/pages/profile/profile.module').then(
        (mod) => mod.ProfileModule
      ),
    data: { state: 'profile' },
    title: 'Profile',
  },
  {
    path: 'policy',
    loadChildren: () =>
      import('./1.modules/policy/policy.module').then(
        (mod) => mod.PolicyModule
      ),
    data: { state: 'policy' },
    title: 'Policy',
  },
  {
    path: 'tos',
    loadChildren: () =>
      import('./1.modules/policy/policy.module').then(
        (mod) => mod.PolicyModule
      ),
    data: { state: 'tos' },
    title: 'Terms of Service',
  },

  {
    path: '**',
    redirectTo: '/home',
    data: { state: 'home' },
    // Maybe create a page not found component page instead of just going to the 'home'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

/*
vdTTcs8PN5fyBKz3SXOKCl09hlF3 Murray
cW5vCsElpETTpUJgT6UEDRSxadq2 Cassie
webhook: we_1M0mE4G9uU7PPnpFKwemadcN,
*/
