import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { first, from, map, Observable } from 'rxjs';
import { PolicyDocuments } from 'app/5.models/policy-documents';
import { convertSnaps } from './db-utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private policyCollection: AngularFirestoreCollection<PolicyDocuments>;
  private policyItems: Observable<PolicyDocuments[]>;

  constructor(public afs: AngularFirestore, private snackBar: MatSnackBar) {
    this.policyCollection = afs.collection<PolicyDocuments>('policy');
    this.policyItems = this.policyCollection.valueChanges({ idField: 'id' });
  }

  getAll() {
    return this.policyItems;
  }

  getAvailablePolicyDocuments() {
    return this.getAll().pipe(
      map((inventory) =>
        inventory.filter((available) => available.show_allowed === true)
      )
    );
  }

  get(id: string) {
    return this.policyCollection.doc(id).get();
  }

  findPolicyByUrl(id: string): Observable<PolicyDocuments | undefined> {
    return this.afs
      .collection('policy', (ref) => ref.where('id', '==', id))
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          const product = convertSnaps<PolicyDocuments>(snaps);
          return product.length == 1 ? product[0] : undefined;
        }),
        first()
      );
  }

  create(mtPolicy: PolicyDocuments) {
    return this.policyCollection.add(mtPolicy);
  }

  update(mtPolicy: PolicyDocuments) {
    this.policyCollection.doc(mtPolicy.id.toString()).update(mtPolicy);
  }

  delete(id: string) {
    this.policyCollection.doc(id).delete();
  }
}
