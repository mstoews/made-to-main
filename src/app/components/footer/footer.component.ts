import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer-component.html',
})
export class FooterComponent implements OnInit {

  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient) { }



  ngOnInit(): void {
  }

}
