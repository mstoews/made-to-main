import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'sign-out-classic',
  templateUrl: './sign-out.component.html',
  encapsulation: ViewEncapsulation.None,
  
})
export class SignOutClassicComponent {
  countdown: number = 5;
  countdownMapping: any = { '=1': '# second', other: '# seconds' };

  /**
   * Constructor
   */
  constructor(private _router: Router) {}
}
