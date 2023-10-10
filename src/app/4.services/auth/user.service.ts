import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserRoles } from '../../5.models/user-roles';
import { Auth, user, onAuthStateChanged } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private afAuth: Auth, private router: Router) {

  }

  isLoggedIn$: Observable<boolean>  = of(true);
  isLoggedOut$: Observable<boolean> = of(true);

  roles$ = of(this.afAuth.onIdTokenChanged((user) =>
    user?.getIdTokenResult().then((token) => token?.claims ?? {})
  ));

  // logout() {
  //   this.afAuth.signOut();
  //   this.router.navigateByUrl('/login');
  // }
}
