import { Injectable, OnDestroy, inject } from '@angular/core';
import { IUser } from './users';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  userData: any;
  userId: string;
  isAnonymous: boolean;
  isAdminUser: boolean;
  isRegistered: boolean;
  email: string;
  private userName: string;
  private destroy$ = new Subject<void>();

  // private subject = new BehaviorSubject<User>(ANONYMOUS_USER);

  setUserName(userName: string) {
    this.userName = userName;
  }

  getUserName(): string {
    return this.userName;
  }

  constructor(
    public router: Router,
    private auth: Auth,
    private snackBar: MatSnackBar
  ) {
    if (auth) {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.userId = user.uid;
          this.email = user.email;
          this.isAnonymous = user.isAnonymous;
          this.isRegistered = user.emailVerified;
        } else {
          this.userId = undefined;
          this.email = undefined;
          this.isRegistered = undefined;
        }
      });
      this.auth.onIdTokenChanged((user) => {
        if (user) {
          user.getIdTokenResult().then((idTokenResult) => {
              idTokenResult.claims.admin ? this.isAdminUser = true : this.isAdminUser = false;
          });
        }
      });
    }
  }

  public isUserAdmin(): Observable<boolean> {
    return new Observable<boolean>((observer) => {

      this.auth.onIdTokenChanged((user) => {
        if (user) {
          user.getIdTokenResult().then((idTokenResult) => {
            observer.next(idTokenResult.claims.admin);
          });
        } else {
          this.userId = undefined;
          this.email = undefined;
          this.isRegistered = undefined;
          observer.next(false);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async signIn(email: string, password: string) {
    const credentials = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  }

  async registerUser(email: string, password: string) {
    const credentials = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  }

  // Send email verfificaiton when new user sign up
  async SendVerificationMail() {
    await sendEmailVerification(this.auth.currentUser)
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Reset Forggot password
  async ForgotPassword(passwordResetEmail: string) {
    await sendPasswordResetEmail(this.auth, passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Sign out
  SignOut() {
    signOut(this.auth).then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  async getUserId() {
    return this.userId
  }
}
// Sign out
