import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.css']
})
export class TosComponent {

  constructor( private route: Router) {
    
  }

  backToHome() {
    this.route.navigate(['home']);
  }

}
