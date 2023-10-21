import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PolicyDocuments } from '../models/policy-documents';
import { Observable } from 'rxjs';
import { PolicyService } from './policy.service';

@Injectable({ providedIn: 'root' })
export class PolicyResolver {
  constructor(private policyService: PolicyService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PolicyDocuments> | PolicyDocuments {
    const id = route.paramMap.get('id') as string;
    return this.policyService.getById(id);
  }
}
