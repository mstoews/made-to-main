import { Injectable, inject } from '@angular/core';
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
    auth: Auth = inject(Auth);


    constructor(
      public authService: AuthService,
      private router: Router
    ) {
      this.auth.onIdTokenChanged((user) => {
        this.isLoggedIn$ = of(true);
        this.isLoggedOut$ = of(false);
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

    getUserId(): string {
      const user = getAuth().currentUser;
      if (user) {
        return user.uid;
      }
      return '';
    }

}
