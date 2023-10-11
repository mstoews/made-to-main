import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { filter, Observable, Subscription } from 'rxjs';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { openAddPolicyDialog } from './add/add.component';
import { PolicyDocuments } from 'app/5.models/policy-documents';
import { PolicyService } from 'app/4.services/policy.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyComponent {
  policyGroup: FormGroup;
  sTitle: string;
  cRAG: string;
  currentDate: Date;

  policyId: string;

  @Input() title: string;
  @Input() description: string;
  @Input() rich_description: string;

  // Lightbox setup
  private _subscription: Subscription;

  // blog dictionary
  allPolicies$: Observable<PolicyDocuments[]>;

  columnsToDisplay: string[] = ['description', 'rich_description'];

  policy: PolicyDocuments;

  selectedItemKeys: any;

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private route: Router,
    private dialog: MatDialog
  ) {}

  onOpenRow(row: any) {
    this.route.navigate(['policy/policy-admin', row.id]);
  }

  onAdd() {
    openAddPolicyDialog(this.dialog, this.policy)
      .pipe(filter((val) => !!val))
      .subscribe((val) => console.debug('new course value:', val));
  }

  ngOnInit() {
    this.Refresh();
    this.cRAG = '#238823';
  }

  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }

  onCellDoublClicked(e: any) {
    this.title = e.title;
    this.rich_description = e.rich_description;
    this.policyGroup.setValue(e);
  }

  onNotify(event: any) {
    this.policyGroup.setValue(event.data);
  }

  Refresh() {
    this.allPolicies$ = this.policyService.getAll();
  }

  onCreate(data: any) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const newPolicy = { ...this.policyGroup.value } as PolicyDocuments;
    newPolicy.date_updated = updateDate;
    newPolicy.date_created = updateDate;
    this.policyService.add(newPolicy);
  }

  onDelete(data: PolicyDocuments) {
    if (confirm('Are you sure you want to delete ?') === true) {
    data = this.policyGroup.getRawValue();
    this.policyService.delete(data.id.toString());
    }
    return true
  }


  // ERROR TypeError: Cannot read properties of null (reading 'addControl')
  //   at FormControlName._setUpControl (/home/mst/Projects/made-to/node_modules/.pnpm/@angular+forms@16.0.5_4qq3iruz7kfh6amajr4i2lp45e/node_modules/@angular/forms/fesm2022/forms.mjs:5370:43)
  //   at FormControlName.ngOnChanges (/home/mst/Projects/made-to/node_modules/.pnpm/@angular+forms@16.0.5_4qq3iruz7kfh6amajr4i2lp45e/node_modules/@angular/forms/fesm2022/forms.mjs:5315:18)
  //   at FormControlName.rememberChangeHistoryAndInvokeOnChangesHook (/home/mst/Projects/made-to/node_modules/.pnpm/@angular+core@16.0.5_rxjs@7.5.7+zone.js@0.13.0/node_modules/@angular/core/fesm2022/core.mjs:2841:14)
  //   at callHookInternal (/home/mst/Projects/made-to/node_modules/.pnpm/@angular+core@16.0.5_rxjs@7.5.7+zone.js@0.13.0/node_modules/@angular/core/fesm2022/core.mjs:3833:14)
  //   at callHook (/home/mst/Projects/made-to/node_modules/.pnpm/@angular+core@16.0.5_rxjs@7.5.7+zone.js@0.13.0/node_modules/@angular/core/fesm2022/core.mjs:3864:9)
  //   at callHooks (/home/mst/Projects/made-to/node_modules/.pnpm/@angular+core@16.0.5_rxjs@7.5.7+zone.js@0.13.0/node_modules/@angular/core/fesm2022/core.mjs:3815:17)
  //   at executeInitAndCheckHooks (/home/mst/Projects/made-to/node_modules/.pnpm/@angular+core@16.0.5_rxjs@7.5.7+zone.js@0.13.0/node_modules/@angular/core/fesm2022/core.mjs:3765:9)
  //   at selectIndexInternal (/home/mst/Projects/made-to/node_modules/.pnpm/@angular+core@16.0.5_rxjs@7.5.7+zone.js@0.13.0/node_modules/@angular/core/fesm2022/core.mjs:10483:17)
  //   at Module.ɵɵadvance (/home/mst/Projects/made-to/node_modules/.pnpm/@angular+core@16.0.5_rxjs@7.5.7+zone.js@0.13.0/node_modules/@angular/core/fesm2022/core.mjs:10466:5)
  //   at ProductEditComponent_ng_container_0_Template (http://localhost:43220/src_app_1_modules_admin_admin_module_ts.js:2805:60) {stack: 'TypeError: Cannot read properties of null (re…p_1_modules_admin_admin_module_ts.js:2805:60)', message: 'Cannot read properties of null (reading 'addControl')'}



  valueChangedEvent(e: any) {
    // console.debug(`blog grid value changed ${e}`)
  }

  createForm(policy: PolicyDocuments) {
    this.sTitle = 'Policy - ' + policy.description;
    this.policyGroup = this.fb.group({
      id: [policy.id],
      description: [policy.description],
      rich_description: [policy.rich_description],
      user_updated: [policy.user_updated],
      date_created: [policy.date_created],
      date_updated: [policy.date_updated],
    });
  }
}
