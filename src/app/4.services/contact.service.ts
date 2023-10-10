import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from 'app/5.models/contact';
import { Firestore, collection, collectionData, addDoc, doc, docData, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContactService {

  firestore = inject(Firestore);

  //Query

  getAll() {
    const collectionRef = collection(this.firestore, 'contacts');
    return collectionData(collectionRef, { idField: 'id' }) as Observable<Contact[]>;
  }

  getById(id: string) {
    const collectionRef = collection(this.firestore, 'category');
    const blog = doc(collectionRef, id);
    return docData(blog) as Observable<Category>;
  }

  getCategoryList() {
    return this.getAll().pipe(
      map((category) =>
        category.filter((available) => available.isUsed === true)
      )
    );
  }

  // Add
  add(category: Category) {
    return addDoc(collection(this.firestore, 'category'), category);
  }

  // Update

  update(category: Category) {
    const ref = doc(
      this.firestore,
      'category',
      category.id
    ) as DocumentReference<Category>;
    return updateDoc(ref, category);
  }

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

    this.contactCollection.add(contact_update);
  }



}
