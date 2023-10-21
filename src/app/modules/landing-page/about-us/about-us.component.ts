import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {

  constructor(
      private route: Router,
  ) {

  }

  backToHome() {
      this.route.navigate(['home']);
  }


}
