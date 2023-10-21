import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {
 constructor(private route: Router,) {

 }
 backToHome(){
  this.route.navigate(['home']);
 }
}
