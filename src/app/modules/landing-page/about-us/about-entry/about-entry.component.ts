import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-about-entry',
  templateUrl: './about-entry.component.html',
  styleUrls: ['./about-entry.component.css'],
})
export class AboutEntryComponent {

  @Input() aboutEntry: string;

}
