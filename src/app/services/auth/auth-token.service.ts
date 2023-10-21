import {Injectable} from "@angular/core";
import { Auth } from '@angular/fire/auth';


@Injectable({
    providedIn: "root"
})
export class AuthTokenService {
    authJwtToken:string | null;
    constructor(private afAuth: Auth) {
        afAuth.onIdTokenChanged((user) => {
            if (user) {
                user.getIdToken().then((jwt) => (this.authJwtToken = jwt));
            }
        });
      }
}
