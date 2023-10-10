import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/4.services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { catchError, first, throwError } from 'rxjs';
import { UserService } from 'app/4.services/auth/user.service';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private userId: string;
  public displayName: string;
  public loggedIn: boolean;

  constructor(
    private router: Router,
    private auth: Auth,
    public authService: AuthService,
    public afs: AngularFirestore,
    public userService: UserService,
    private http: HttpClient
  )
  {
        this.authService.getUserId().then ( (userId) => {
          this.userId = userId;
        });
   };

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

  ngOnInit() {
    this.loggedIn = false;
    this.auth.onAuthStateChanged((user) => {
        if (user !== null) {
          this.loggedIn = true;
          // console.debug( `this user : ${this.userId} is registered ? : ${this.loggedIn}`);
        } else {
          this.loggedIn = false;
        }
      })
  }

  backToHome() {
    this.router.navigate(['home']);
  }

  updateProfile(userId: string) {
    // console.debug('updateProfile', userId);
  }
}
