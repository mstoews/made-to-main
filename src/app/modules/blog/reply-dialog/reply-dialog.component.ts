import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'reply-dialog',
  templateUrl: './reply-dialog.component.html',
})
export class ReplyDialogComponent {
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  formGroup: FormGroup;

  createForm() {
    this.formGroup = this.fb.group({
      reply: '',
    });
  }

  Cancel() {
    this.dialogRef.close({ action: 'cancel'});
  }

  onUpdateReply() {
    const reply = this.formGroup.getRawValue();
    
    this.dialogRef.close({ action: 'update', reply });
  }

}
