import { inject, Injectable } from '@angular/core';
import { first, map, Observable, tap } from 'rxjs';
import { Collection, CollectionsPartial } from 'app/models/collection';
import { CollectionsComments } from 'app/models/collection';

import { ImageItemIndexService } from './image-item-index.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  DocumentReference,
  Firestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  firestore = inject(Firestore);
  snack = inject(MatSnackBar);
  imageItemIndexService = inject(ImageItemIndexService);

  createComment(comment: CollectionsComments) {
    // const collectionRef = this.afs.collection(
    //   `/collections/${comment.col_id}/comment`
    // );
    // collectionRef
    //   .add(comment)
    //   .then((newComment) => {
    //     comment.id = newComment.id;
    //     this.updateComment(comment);
    //     this.snack.open('Comment added to the thoughts ... ', 'OK', {
    //       verticalPosition: 'top',
    //       horizontalPosition: 'right',
    //       panelClass: 'bg-danger',
    //     });
    //   })
    //   .catch((error) => {
    //     alert('Unable to update comment');
    //   })
    //   .finally();
  }

  addCommentReply(collection_id: string, commentId: string, reply: string) {
    // const collectionRef = this.afs.collection(
    //   `collection/${collection_id}/comment/`,
    //   (ref) => ref.orderBy('date_created', 'desc')
    // );
    // const dDate = new Date();
    // const updateDate = dDate.toISOString();
    // const comment = { reply: reply, reply_date: updateDate };
    // collectionRef.doc(commentId).update(comment);
  }

  deleteComment(collection_id: string, comment_id: string) {
    // const collectionRef = this.afs.collection(
    //   `collection/${collection_id}/comment/`,
    //   (ref) => ref.orderBy('created_date', 'desc')
    // );
    // collectionRef.doc(comment_id).delete();
  }

  updateComment(comment: CollectionsComments) {
    // const collectionRef = this.afs.collection(
    //   `collection/${comment.col_id}/comment/`
    // );
    // collectionRef.doc(comment.id).update(comment);
  }

  getComments(collection_id: string): any {
    // const collectionRef = this.afs.collection(
    //   `collection/${collection_id}/comment/`,
    //   (ref) => ref.orderBy('created_date', 'desc')
    // );
    // const commentItems = collectionRef.valueChanges({ idField: 'id' });
    // return commentItems;
  }

  setToPublish(collection: Collection) {
    collection.published = true;
  }

  getAll() {
    const collectionRef = collection(this.firestore, 'collection');
    return collectionData(collectionRef, { idField: 'id' }) as Observable<
      Collection[]
    >;
  }

  getById(id: string) {
    const collectionRef = collection(this.firestore, 'collection');
    const ref = doc(collectionRef, id);
    return docData(ref) as Observable<Collection>;
  }

  getCollectionList() {
    return this.getAll().pipe(
      map((collection) =>
        collection.filter((available) => available.published === true)
      )
    );
  }

  // Add
  add(collect: Collection) {
    return addDoc(collection(this.firestore, 'category'), collect);
  }

  // Update

  update(collect: Collection) {
    const ref = doc(
      this.firestore,
      'collection',
      collect.id
    ) as DocumentReference<Collection>;
    return updateDoc(ref, collect);
  }

  // Delete
  delete(id: string) {
    const ref = doc(this.firestore, 'category', id);
    return deleteDoc(ref);
  }

  getCollectionsImage(parentId: string): any {
    return this.imageItemIndexService.getImagesByTypeId(parentId);
  }

  getAllPublishedCollections() {
    return this.getAll().pipe(
      map((collections) => collections.filter((pub) => pub.published === true))
    );
  }

  getCollections(id: string) {
    return this.getAll().pipe(
      map((collections) => collections.filter((pub) => pub.id === id))
    );
  }

  findCollectionByUrl(id: string): Observable<Collection> {
    const collectionRef = collection(this.firestore, 'collection');
    const q = query(collectionRef, where('id', '==', id));
    const list = collectionData(q, { idField: 'id' }) as Observable<
      Collection[]
    >;
    return list.pipe(map((col) => col[0]));
  }

  retrieveCollections() {
    return this.getAll();
  }

  createCollection(col: Collection) {
    return this.add(col);
  }

  updatePartial(col: Collection) {
    return this.update(col);
  }

  createPartial(col: Collection) {
    return this.add(col);
  }
}
