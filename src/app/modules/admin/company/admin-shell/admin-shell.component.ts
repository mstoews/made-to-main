import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShellComponent {

  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }

}
