import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from 'app/models/contact';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  docData,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  firestore = inject(Firestore);

  //Query

  getAll() {
    return collectionData(collection(this.firestore, 'contacts'), {
      idField: 'id',
    }) as Observable<Contact[]>;
  }

  getById(id: string) {
    return docData(
      doc(collection(this.firestore, 'contacts'), id)
    ) as Observable<Contact>;
  }

  // Add
  add(contact: Contact) {
    return addDoc(collection(this.firestore, 'contacts'), contact);
  }

  // Update

  // Delete
  delete(id: string) {
    const ref = doc(this.firestore, 'category', id);
    return deleteDoc(ref);
  }

  create(contact: Contact) {
    // console.debug(JSON.stringify(contact));
    const currentDate = new Intl.DateTimeFormat('en');
    const theDate = currentDate.format();
    const contact_update = {
      name: contact.name,
      email: contact.email,
      message: contact.message,
      created_date: theDate,
    };
    addDoc(collection(this.firestore, 'contacts'), contact_update);
  }
}
