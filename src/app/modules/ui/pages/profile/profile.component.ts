import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { catchError, first, throwError } from 'rxjs';
import { UserService } from 'app/services/auth/user.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private userId: string;
  private email: string;
  public displayName: string;
  public loggedIn: boolean;

  constructor(
    private router: Router,
    private auth: Auth,
    private http: HttpClient
  ) {
    this.loggedIn = false;
    auth.onAuthStateChanged((user) => {
      if(user) {
        this.userId = user.uid;
        this.email = user.email;
        this.loggedIn = true;
      }
    });
  }

  addAdminUser(email: string, password: string) {
    const api = environment.api.baseUrl + '/api/addAdminToRole';
    this.http
      .post(api, {
        email: email,
        password: password,
      })
      .pipe(
        catchError((err) => {
          // console.debug(err);
          alert('Could not update User to Admin');
          return throwError(() => new Error());
        })
      )
      .subscribe((user) => {
        // console.debug('Admin updated ... ', user);
      });
  }

  addUserByFunction() {
    const api = environment.api.baseUrl + '/api/addAdminToRole';
    this.http
      .post(api, {
        email: 'cassandra_harada@hotmail.com',
        password: 'secret123',
      })
      .pipe(
        catchError((err) => {
          // console.debug(err);
          alert('Could not update User to Admin');
          return throwError(() => new Error());
        })
      )
      .subscribe((user) => {
        // console.debug('Admin updated ... ', user);
      });
  }


  backToHome() {
    this.router.navigate(['home']);
  }

  updateProfile(userId: string) {
    // console.debug('updateProfile', userId);
  }
}
