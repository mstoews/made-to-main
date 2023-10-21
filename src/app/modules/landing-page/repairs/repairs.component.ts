import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-repairs',
  templateUrl: './repairs.component.html',
  styleUrls: ['./repairs.component.css']
})
export class RepairsComponent implements OnInit {

  constructor(private router: Router) { }
  repairs = './assets/images/repairs.jpg';

  ngOnInit(): void {
  }

  onBackToLanding() {
    this.router.navigate(['/home'])
  }


}
