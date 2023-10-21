import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
