import { Component, Input, OnInit } from '@angular/core';
import { ScrollService } from 'app/services/scroll.service';

@Component({
  selector: 'app-service-description',
  templateUrl: './service-description.component.html',
  styleUrls: ['./service-description.component.css'],
})
export class ServiceDescriptionComponent implements OnInit {
  @Input() public cta_left: string = '';
  @Input() public cta_right: string = '';

  constructor(private scrollTo: ScrollService) {}

  ngOnInit(): void {}

  scrollToId(id: string) {
    // console.debug('element id : ', id);
    this.scrollTo.scrollToElementById(id);
  }
}
