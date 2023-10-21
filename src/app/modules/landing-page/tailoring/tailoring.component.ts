import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-tailoring',
  templateUrl: './tailoring.component.html',
  styleUrls: ['./tailoring.component.css'],
})
export class TailoringComponent implements OnInit {
  constructor(private router: Router) {}
  header_title = "Bespoke Tailoring"
  tailoring_image= './assets/images/tailoring_image.jpeg';
  onContacts() {
    this.router.navigate(['/home/contacts'])
  }
  ngOnInit(): void {}
}

