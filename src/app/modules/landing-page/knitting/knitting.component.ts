import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-knitting',
  templateUrl: './knitting.component.html',
  styleUrls: ['./knitting.component.css']
})
export class KnittingComponent implements OnInit {

  constructor (private router: Router, private _location: Location ) { }
  knitting_image = './assets/images/flamyarn_800x800.jpg';

  onBack() {
    this._location.back()
    // this.router.navigate(['/home'])
  }

  ngOnInit(): void { }

  onContacts() {
    this.router.navigate(['/home/contacts'])
  }

}
