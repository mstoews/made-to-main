import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  inject,
} from '@angular/core';

import {
  Form,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { AuthService } from 'app/services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'sign-in-classic',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SignInClassicComponent implements OnInit, OnDestroy {
  signInForm: FormGroup;

  signIn() {
    let password = this.signInForm.value.password;
    let email = this.signInForm.value.email;

    this.authService.signIn(email, password).then(
      (result) => {
        this.onLoginSuccess(result);
      },
      (error) => {
        this.showAlert = true;
      }
    );
  }

  showAlert: boolean = false;
  redirect = ['/home'];

  constructor(
    private authService: AuthService,
    public router: Router,
    public fb: FormBuilder
  ) {
    this.createEmptyForm();
  }

  createEmptyForm() {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onLoginSuccess(result) {
    this.router.navigate(this.redirect);
  }
  ngOnDestroy() {}
}
