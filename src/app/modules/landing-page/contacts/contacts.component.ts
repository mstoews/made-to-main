import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Mainpage } from 'app/models/mainpage';
import { catchError, Observable, throwError } from 'rxjs';
import { MainPageService } from 'app/services/main-page.service';
import { Contact } from 'app/models/contact';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sendEmailVerification } from 'firebase/auth';
import { ContactService } from 'app/services/contact.service';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent implements OnInit {
  contactGroup: FormGroup;
  mainPage$: Observable<Mainpage[]>;
  mainPageDoc: Mainpage;

  contact: Contact;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private mainPageService: MainPageService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private contactService: ContactService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.mainPage$ = this.mainPageService.getAll();
    this.mainPage$.subscribe((doc) => {
      if (doc.length > 0) {
        this.mainPageDoc = doc[0];
      }
    });
  }

  onSubmit() {
    this.onUpdate(this.contactGroup.value);
  }

  onUpdate(contact: Contact) {
    const currentDate = new Intl.DateTimeFormat('en');
    const theDate = currentDate.format();

    if (environment.production === false) {
      this.http
        .post<any>(environment.dev.createMessage, {
          name: contact.name,
          email: contact.email,
          message: contact.message,
        })
        .pipe(
          catchError((err) => {
            console.debug('Error ', err);
            this._snackBar.open(JSON.stringify(err), 'OK', {
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'bg-danger',
            });
            return throwError(err);
          })
        )
        .subscribe((response: any) => {
          this._snackBar.open(JSON.stringify(response.message), 'OK', {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
          });
          this.contactGroup.reset();
        });
    } else {
      this.http
        .post<any>(environment.api.createMessage, {
          name: contact.name,
          email: contact.email,
          message: contact.message,
        })
        .pipe(
          catchError((err) => {
            console.debug('Error ', err);
            this._snackBar.open(JSON.stringify(err), 'OK', {
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'bg-danger',
            });
            return throwError(() => {
              console.debug(err);
            });
          })
        )
        .subscribe((response: any) => {
          this._snackBar.open(JSON.stringify(response.message), 'OK', {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
          });
          this.contactGroup.reset();
        });
    }
  }

  scrollToId() {
    this.router.navigate(['home']);
  }

  onFeatures() {
    this.router.navigate(['featured']);
  }

  createForm() {
    this.contactGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(100),
        ],
      ],
    });
  }
}
