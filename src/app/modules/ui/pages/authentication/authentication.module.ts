import { NgModule } from '@angular/core';
import { SignInModule } from './sign-in/sign-in.module';
import { SignUpModule } from './sign-up/sign-up.module';
import { SignOutModule } from './sign-out/sign-out.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        SignInModule,
        SignUpModule,
        SignOutModule,

        ReactiveFormsModule,
        FormsModule,


    ],
    exports: [
        SignInModule,
        SignUpModule,
        SignOutModule,

    ]
})
export class AuthenticationModule
{
}
