import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ready-to-wear',
  templateUrl: './ready-to-wear.component.html',
})
export class ReadyToWearComponent implements OnInit {


  onThoughts() {
   this.router.navigate(['/blog'])
  }

  constructor(private router: Router) {}
  ready_to_wear = './assets/images/ready-to-wear.jpeg';
  knitting_image = './assets/images/flamyarn_800x800.jpg';

  ngOnInit(): void {}

  onBackToLanding() {
    this.router.navigate(['/home']);
  }
}
