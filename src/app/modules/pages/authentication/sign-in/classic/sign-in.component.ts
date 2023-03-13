import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core'
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'

import { fuseAnimations } from '@fuse/animations'
import { FuseAlertType } from '@fuse/components/alert'
import { AuthService } from 'app/services/auth/auth.service'
import * as firebaseui from 'firebaseui';

import {Router} from '@angular/router';
import firebase from 'firebase/app';
import { EmailAuthCredential, EmailAuthProvider, GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth'



@Component({
  selector: 'sign-in-classic',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SignInClassicComponent implements OnInit, OnDestroy {
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  }
  signInForm!: UntypedFormGroup
  showAlert: boolean = false
  redirect = ['/home']
  ui: firebaseui.auth.AuthUI;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Create the form

    this.authService.afAuth.app.then( app => {
        const uiConfig = {
            signInOptions: [
                EmailAuthProvider.PROVIDER_ID,
                GoogleAuthProvider.PROVIDER_ID,

            ],
            callbacks: {
                signInSuccessWithAuthResult: this.onLoginSuccess.bind(this)
            }
        };

        this.ui = new firebaseui.auth.AuthUI(app.auth());

        this.ui.start("#firebaseui-auth-container", uiConfig);

        this.ui.disableAutoSignIn();
    });
  }

  onLoginSuccess(result) {
    const user = this.authService.afAuth.currentUser;
    user.then(sendEmail => {
      //this.router.navigate(['/authentication/confirmation-required/split-screen']);
      console.log('user id send mail onLoginSuccess:', sendEmail.uid);
      //sendEmail.sendEmailVerification();
      this.router.navigate(['/home']);
    }).catch(error => {
      console.log('Verification email not sent', error.message);
    }).finally();
  }

  signUpEmail(){
    this.router.navigate(['/authentication/confirmation-required/modern']);
  }

  async signInEmail() {
    const { email, password } = this.signInForm.value
    // console.debug(`email ${email} , ${password}`)
    try {
      const loggedIn = await this.authService.signIn(email, password)
      this.router.navigate(this.redirect)
    } catch (e) {
      console.error(e)
    }
  }

  ngOnDestroy() {
    this.ui.delete();
  }

}