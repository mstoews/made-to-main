import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PolicyDocuments } from 'app/5.models/policy-documents';

import { PolicyService } from 'app/4.services/policy.service';

@Component({
  selector: 'policy-preview',
  templateUrl: './policy-preview.component.html',
  styleUrls: ['./policy-preview.component.css'],
})
export class PolicyPreviewComponent implements OnInit {

  @Input() policy: PolicyDocuments;

  mainImage: string;

  constructor(private policyService: PolicyService) {}

  setImage(e: string) {
    this.mainImage = e;
  }


  ngOnInit() {
    if (this.policy.id) {
      this.policyService.getById(this.policy.id).subscribe((policy) => {
        this.policy = policy;
      });
    }
  }
}
