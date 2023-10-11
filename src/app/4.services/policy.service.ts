import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PolicyDocuments } from 'app/5.models/policy-documents';

import { addDoc, collection, collectionData, deleteDoc, doc, docData, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {

  firestore = inject(Firestore);
    //Query
    getAll() {
      const collectionRef = collection(this.firestore, 'policy');
      return collectionData(collectionRef, { idField: 'id' }) as Observable<PolicyDocuments[]>;
    }

    getById(id: string) {
      const collectionRef = collection(this.firestore, 'policy');
      const blog = doc(collectionRef, id);
      return docData(blog) as Observable<PolicyDocuments>;
    }


    // Add
    add(policy: PolicyDocuments) {
      return addDoc(collection(this.firestore, 'policy'), policy);
    }

    // Update

    update(policy: PolicyDocuments) {
      const ref = doc(
        this.firestore,
        'policy',
        policy.id
      ) as DocumentReference<PolicyDocuments>;
      return updateDoc(ref, policy);
    }

    // Delete
    delete(id: string) {
      const ref = doc(this.firestore, 'policy', id);
      return deleteDoc(ref);
    }
}
