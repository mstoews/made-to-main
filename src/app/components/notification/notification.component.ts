import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @Input() actionTitle: string;
  @Input() actionExplanation: string;
  constructor() {}

  notification: boolean = false;
  notificationBtn() {
    this.notification = !this.notification;
  }
  ngOnInit(): void {}
}


