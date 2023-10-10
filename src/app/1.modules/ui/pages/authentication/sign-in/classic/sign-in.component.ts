import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { AuthService } from 'app/4.services/auth/auth.service';
import * as firebaseui from 'firebaseui';

import { Router } from '@angular/router';
import firebase from 'firebase/app';
import {
  EmailAuthCredential,
  EmailAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';

@Component({
  selector: 'sign-in-classic',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,

})
export class SignInClassicComponent implements OnInit, OnDestroy {
  signInForm!: UntypedFormGroup;
  showAlert: boolean = false;
  redirect = ['/home'];
  ui: firebaseui.auth.AuthUI;

  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    // Create the form
    // let anonymousUser = this.authService.afAuth.currentUser;

    // this.authService.afAuth.app.then((app) => {
    //   const uiConfig = {
    //     //autoUpgradeAnonymousUsers: true,
    //     signInOptions: [
    //       EmailAuthProvider.PROVIDER_ID,
    //       // GoogleAuthProvider.PROVIDER_ID,
    //     ],
    //     callbacks: {
    //       signInSuccessWithAuthResult: this.onLoginSuccess.bind(this),
    //     },
    //   };

    //   this.ui = new firebaseui.auth.AuthUI(app.auth());

    //   this.ui.start('#firebaseui-auth-container', uiConfig);

    //   this.ui.disableAutoSignIn();
    // });
  }

  onLoginSuccess(result) {
    // const user = this.authService.getUserId().then((id) => {
    //   console.debug('User ID: ', id);
    // }

    // user
    //   .then((sendEmail) => {
    //     console.debug('Verification mail ', sendEmail.emailVerified);
    //     if (sendEmail.emailVerified == false) {
    //       sendEmail.sendEmailVerification();
    //     }

    //     this.router.navigate(['/home']);
    //   })
    //   .catch((error) => {
    //     console.debug('Verification email not sent', error.message);
    //   })
    //   .finally();
  }

  // async signInEmail() {
  //   const { email, password } = this.signInForm.value
  //   // console.debug(`email ${email} , ${password}`)
  //   try {
  //     const loggedIn = await this.authService.signIn(email, password)
  //     this.router.navigate(this.redirect)
  //   } catch (e) {
  //     console.error(e)
  //     console.debug("tesst");
  //   }
  // }

  ngOnDestroy() {
    this.ui.delete();
  }
}
