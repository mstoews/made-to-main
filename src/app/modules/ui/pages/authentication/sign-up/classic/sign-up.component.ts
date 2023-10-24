import { Component, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';


@Component({
  selector: 'sign-up-classic',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,

})
export class SignUpClassicComponent implements OnInit {
  @ViewChild('signUpNgForm') signUpNgForm!: NgForm;

  authService = inject(AuthService);
  router = inject(Router);

  signUpForm!: UntypedFormGroup;
  showAlert: boolean = false;

  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    // Create the form
    this.signUpForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      company: [''],
      agreements: ['', Validators.requiredTrue],
    });
  }

  signUp(): void {
    const { user, password } = this.signUpForm.value;
    this.authService.registerUser(user, password).then(
      (result) => {
        this.onSignUpSuccess(result);
      },
      (error) => {
        this.showAlert = true;
      }
    );
  }

  onSignUpSuccess(result) {
    if (result) {
      this.signUpNgForm.resetForm();
      this.router.navigate(['/home']);
    }
    // send a verification email to the users
    // wait until the user has verified the login before allowing them to login
  }
}
