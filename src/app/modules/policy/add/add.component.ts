import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Category } from 'app/models/category';
import { PolicyDocuments } from 'app/models/policy-documents';
import { Product } from 'app/models/products';
import { CategoryService } from 'app/services/category.service';
import { PolicyService } from 'app/services/policy.service';
import { ProductsService } from 'app/services/products.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddPolicyComponentDialog {
  description: string;
  form: FormGroup;
  policyId: string;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private product: Product,
    private readonly policyService: PolicyService,
    private readonly categoryService: CategoryService,
    private dialogRef: MatDialogRef<AddPolicyComponentDialog>,
    private route: Router
  ) {
    this.description = product.description;
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.form = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      rich_description: ['', Validators.required],
      date_created: ['', Validators.required],
    });
  }

  update(results: PolicyDocuments) {
    const newPolicyDoc = { ...this.form.value } as PolicyDocuments;

    const theDate = new Date();

    this.policyService.add(newPolicyDoc).then((policy) => {
      this.policyId = policy.id;
      newPolicyDoc.id = this.policyId;
      this.policyService.update(newPolicyDoc);
      this.route.navigate(['policy', this.policyId]);
    });

    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}

export function openAddPolicyDialog(
  dialog: MatDialog,
  policy: PolicyDocuments
) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'modal-panel';
  config.backdropClass = 'backdrop-modal-panel';
  config.width = '450px';

  config.data = {
    ...policy,
  };

  const dialogRef = dialog.open(AddPolicyComponentDialog, config);
  return dialogRef.afterClosed();
}
