import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserRoles } from '../../5.models/user-roles';
import { Auth, user, onAuthStateChanged } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { AuthService } from './auth.service';

  @Injectable({
    providedIn: 'root',
  })
  export class UserService {

    isAdmin$: Observable<boolean> = of(false);
    isLoggedIn$: Observable<boolean> = of(false);
    isLoggedOut$: Observable<boolean> = of(true);

    constructor(
      public authService: AuthService,
      public Auth: Auth,
      private router: Router
    ) {
      this.Auth.onIdTokenChanged((user) => {
        this.isLoggedIn$ = of(!!user);
        this.isLoggedOut$ = of(!user);
        if (user) {
          user.getIdTokenResult().then((idTokenResult) => {
            if (!!idTokenResult.claims.admin) {
              // Show admin UI.
              this.isAdmin$ = of(true);
            } else {
              // Show regular user UI.
              this.isAdmin$ = of(false);
            }
          });
        } else {
          // Show regular user UI.
          this.isAdmin$ = of(false);
        }
      });
    }

}
