import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { first, map, Observable, tap } from 'rxjs';
import { Collection, CollectionsPartial } from 'app/5.models/collection';
import { CollectionsComments } from 'app/5.models/collection';
import { convertSnaps } from './db-utils';
import { ImageItemIndexService } from './image-item-index.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private colCollection: AngularFirestoreCollection<Collection>;
  private colPartialCollection: AngularFirestoreCollection<CollectionsPartial>;
  private colItems: Observable<Collection[]>;
  private commentItems: Observable<CollectionsComments[]>;
  private commentCollection: AngularFirestoreCollection<CollectionsComments>;

  constructor(
    private afs: AngularFirestore,
    private snack: MatSnackBar,
    private imageItemIndexService: ImageItemIndexService
  ) {
    this.colCollection = afs.collection('collection', (ref) =>
      ref.orderBy('date_created', 'desc')
    );
    this.colItems = this.colCollection.valueChanges({ idField: 'id' });
    this.colPartialCollection =
      afs.collection<CollectionsPartial>('collection');
  }

  createComment(comment: CollectionsComments) {
    const collectionRef = this.afs.collection(
      `/collections/${comment.col_id}/comment`
    );

    collectionRef
      .add(comment)
      .then((newComment) => {
        comment.id = newComment.id;
        this.updateComment(comment);
        this.snack.open('Comment added to the thoughts ... ', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
        });
      })
      .catch((error) => {
        alert('Unable to update comment');
      })
      .finally();
  }

  addCommentReply(collection_id: string, commentId: string, reply: string) {
    const collectionRef = this.afs.collection(
      `collection/${collection_id}/comment/`,
      (ref) => ref.orderBy('date_created', 'desc')
    );
    const dDate = new Date();
    const updateDate = dDate.toISOString();
    const comment = { reply: reply, reply_date: updateDate };
    collectionRef.doc(commentId).update(comment);
  }

  deleteComment(collection_id: string, comment_id: string) {
    const collectionRef = this.afs.collection(
      `collection/${collection_id}/comment/`,
      (ref) => ref.orderBy('created_date', 'desc')
    );
    collectionRef.doc(comment_id).delete();
  }

  updateComment(comment: CollectionsComments) {
    const collectionRef = this.afs.collection(
      `collection/${comment.col_id}/comment/`
    );
    collectionRef.doc(comment.id).update(comment);
  }

  getComments(collection_id: string): any {
    const collectionRef = this.afs.collection(
      `collection/${collection_id}/comment/`,
      (ref) => ref.orderBy('created_date', 'desc')
    );
    const commentItems = collectionRef.valueChanges({ idField: 'id' });
    return commentItems;
  }

  setToPublish(collection: Collection) {
    collection.published = true;
    this.colCollection.doc(collection.id).update(collection);
  }

  getCollectionsImage(parentId: string): any {
    return this.imageItemIndexService.getImagesByTypeId(parentId);
  }

  getAllPublishedBlog() {
    return this.colItems.pipe(
      map((collections) => collections.filter((pub) => pub.published === true))
    );
  }

  getAll(): Observable<Collection[]> {
    return this.colItems;
  }

  getCollections(id: string) {
    const ref = this.afs
      .collection<Collection>('collection', (ref) =>
        ref.where('id', '==', id).limit(1)
      )
      .snapshotChanges()
      .pipe(
        map((collection) =>
          collection.map((a) => {
            // console.debug(a.payload.doc.id);
          })
        )
      );
  }

  findCollectionByUrl(id: string): Observable<Collection | undefined> {
    return this.afs
      .collection('collection', (ref) => ref.where('id', '==', id))
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          const col = convertSnaps<Collection>(snaps);
          return col.length == 1 ? col[0] : undefined;
        }),
        first()
      );
  }

  retrieveCollections() {
    return this.colItems;
  }

  createCollection(col: Collection) {
    col.published = false;
    return this.colCollection.add(col);
  }

  update(col: Collection) {
    this.colCollection.doc(col.id).update(col);
  }

  updatePartial(col: CollectionsPartial) {
    return this.colCollection.doc(col.id).update(col);
  }

  createPartial(col: CollectionsPartial) {
    return this.colPartialCollection.add(col);
  }

  delete(id: string) {
    this.colCollection.doc(id).delete();
  }
}
