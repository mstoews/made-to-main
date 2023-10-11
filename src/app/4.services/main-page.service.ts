import { Injectable, inject } from '@angular/core';
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  collectionData,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, Subscription, map } from 'rxjs';
import { Mainpage } from 'app/5.models/mainpage';

@Injectable({
  providedIn: 'root',
})
export class MainPageService {

  firestore: Firestore = inject(Firestore);

  //Query
  getAll() {
    const collectionRef = collection(this.firestore, 'mainpage');
    return collectionData(collectionRef, { idField: 'id' }) as Observable<Mainpage[]>;
  }

  getById(id: string) {
    const collectionRef = collection(this.firestore, 'mainpage');
    const docRef = doc(collectionRef, id);
    return docData(docRef) as Observable<Mainpage>;
  }

  // Add
  add(mainpage: Mainpage) {
    return addDoc(collection(this.firestore, 'mainpage'), mainpage);
  }

  // Update
  update(mainpage: Mainpage) {
     const ref = doc(this.firestore,'mainpage', mainpage.id) as DocumentReference<Mainpage>;
     return updateDoc(ref, mainpage);
  }

  // Delete
  delete(id: string) {
    const ref = doc(this.firestore, 'mainpage', id);
    return deleteDoc(ref);
  }


}
