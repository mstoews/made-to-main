import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Services } from 'app/5.models/services';
import { Firestore, addDoc, collection, collectionData, updateDoc, deleteDoc, doc, DocumentReference } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor(public afs: Firestore) {

  }

  getAll() {
    return collectionData(collection(this.afs, 'services'), {idField:  'id'}) as  Observable<Services[]>
  }

  create(services: Services) {
    return addDoc(collection(this.afs, 'services'), services);
  }

  update(services: Services) {
    const ref = doc(this.afs, 'services', services.id.toString()) as DocumentReference<Services>;
    return updateDoc(ref, services);
  }

  delete(id: string) {
    return deleteDoc(doc(this.afs, 'services', id));
  }
}
