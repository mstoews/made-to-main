import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from 'app/services/policy.service';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

import { PolicyDocuments } from 'app/models/policy-documents';

@Component({
  selector: 'app-product-edit',
  templateUrl: './policy-edit.component.html',
  styleUrls: ['./policy-edit.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PolicyEditComponent implements OnInit {
  sTitle: any;
  rich_description: string;
  readonly_rich_description: string;
  description: string;
  policyGroup: FormGroup;

  policyId: string;
  selectedItemKeys: string;
  allPolicyDocuments$: Observable<PolicyDocuments>;

  policyItem$: Observable<PolicyDocuments>;
  policy: PolicyDocuments;

  constructor(
    private activateRoute: ActivatedRoute,
    private route: Router,
    private _location: Location,
    private readonly policyService: PolicyService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.createEmptyForm();
  }
  public editorType = 'markdown';

  ngOnInit() {
    var id: string;
    this.policy = this.activateRoute.snapshot.data['policy'];

    if (this.policy) {
      this.rich_description = this.policy.rich_description;
      this.readonly_rich_description = this.policy.rich_description;
      this.description = this.policy.description;
      this.createForm(this.policy);
    }
  }

  onDelete(data: PolicyDocuments) {
    data = this.policyGroup.getRawValue();
    this.policyService.delete(data.id.toString());
    this.route.navigate(['admin/policy']);
  }

  onUpdate() {
    const policy = { ...this.policyGroup.value } as PolicyDocuments;
    console.debug('PolicyDocuments can be sold ...: ', policy.show_allowed);
    const dDate = new Date();
    policy.rich_description = this.rich_description;
    this.readonly_rich_description = this.rich_description;
    const updateDate = dDate.toISOString().split('T')[0];
    this.policyService.update(policy);
  }

  createProduct(results: any) {
    const newPolicy = { ...this.policyGroup.value } as PolicyDocuments;
    this.policyService.update(newPolicy);
    this.policyGroup.setValue(newPolicy);
  }

  createEmptyForm() {
    this.policyGroup = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      show_allowed: [true, Validators.requiredTrue],
    });
  }

  createForm(prd: PolicyDocuments) {
    this.sTitle = 'Policy - ' + prd.description;
    this.policyGroup = this.fb.group({
      id: [prd.id],
      description: [prd.description],
      show_allowed: [prd.show_allowed],
    });
  }

  onBackToInventory() {
    this._location.back();
  }
}
