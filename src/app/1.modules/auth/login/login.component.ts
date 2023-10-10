import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private afAuth: Auth, private router: Router) { }

  ngOnInit(): void {}

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.debug('successCallback', data);
    this.router.navigate(['/']);
  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

  uiShownCallback() {
    console.debug('UI shown');
  }
}
