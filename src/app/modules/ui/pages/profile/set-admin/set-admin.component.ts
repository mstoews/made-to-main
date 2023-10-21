import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment.prod';
import { catchError, throwError } from 'rxjs';
//
//const stripe = Stripe('pk_test_51JogSuCGT3ceZF7pYLMW9IZjEOaMGFqz5YOoBaNGTgT8dl72ThRvLgfx1DEFlQPteFpFlwgfpJLPnuJ1X60UCc8m00yEl0F8ra');

@Component({
  selector: 'app-set-admin',
  templateUrl: './set-admin.component.html',
  styleUrls: ['./set-admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetAdminComponent {

  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }
  onAdmin() {
    const currentDate = new Intl.DateTimeFormat('en');
    const theDate = currentDate.format();

    if (environment.production === false) {
      this.http.post<any>(environment.api.createAdmin, {
        admin: true,
      }).pipe( catchError( err => {
        console.debug('Error ', err);
        this._snackBar.open(JSON.stringify(err), 'Not Sent', {
          duration: 3000
        });
        return throwError(err);
      }))
      .subscribe((response: any) => {
            this._snackBar.open(JSON.stringify(response.message), 'OK', {
              duration: 3000
            });
      });
    }

  }


}
