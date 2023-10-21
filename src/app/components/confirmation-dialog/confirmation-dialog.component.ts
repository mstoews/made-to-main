import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'confirmation-dlg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent {
  @Input() summary : string;

  onCancel() {
    return false;
  }

  onConfirmed() {
    return true;
  }

}
