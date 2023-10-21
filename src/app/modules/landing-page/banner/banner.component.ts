import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'landing-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
