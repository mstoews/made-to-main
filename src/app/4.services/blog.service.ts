import { Injectable, inject } from '@angular/core';
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  query,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  collectionData,
  Timestamp,
  orderBy,
} from '@angular/fire/firestore';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';

import { filter, first, map, Observable, tap } from 'rxjs';
import { Blog, BlogPartial, Comments } from 'app/5.models/blog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageItemIndexService } from './image-item-index.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private commentItems: Observable<Comments[]>;

  constructor(private snack: MatSnackBar) {
    // this.blogCollection = afs.collection('blog', (ref) =>
    //   ref.orderBy('date_created', 'desc')
    // );
    // this.blogItems = this.blogCollection.valueChanges({ idField: 'id' });
    // this.blogPartialCollection = afs.collection<BlogPartial>('blog');
  }

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  user$ = authState(this.auth).pipe(
    filter((user) => user !== null),
    map((user) => user!)
  );

  imageItemIndexService = inject(ImageItemIndexService);

  getBlogData(path: string) {
    return collectionData(collection(this.firestore, path), {
      idField: 'id',
    }) as Observable<Blog[]>;
  }
  0;
  createComment(comment: Comments) {
    const collectionRef = collection(
      this.firestore,
      `blog/${comment.blog_id}/comment`
    );

    addDoc(collectionRef, comment)
      .then((newComment) => {
        comment.id = newComment.id;
        this.updateComment(comment);
        this.snack.open('Comment added to the thoughts ... ', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
        });
      })
      .catch((error) => {
        alert('Unable to update comment');
      })
      .finally();
  }

  addCommentReply(blog_id: string, commentId: string, reply: string) {
    const dDate = new Date();
    const updateDate = dDate.toISOString();
    const comment = { reply: reply, reply_date: updateDate };

    const collectionRef = collection(
      this.firestore,
      `blog/${blog_id}/comment/`
    );
    const ref = doc(collectionRef, commentId);
    updateDoc(ref, comment);
  }

  deleteComment(blog_id: string, comment_id: string) {
    const collectionRef = collection(
      this.firestore,
      `blog/${blog_id}/comment/`
    );
    deleteDoc(doc(collectionRef, comment_id));
    // const collectionRef = this.afs.collection(
    //   `blog/${blog_id}/comment/`,
    //   (ref) => ref.orderBy('created_date', 'desc')
    // );
    // collectionRef.doc(comment_id).delete();
  }

  updateComment(comment: Comments) {
    // const collectionRef = collection(this.firestore, `blog/${comment.blog_id}/comment/` );
    // updateDoc(collectionRef,  comment);
    const collectionRef = collection(
      this.firestore,
      `blog/${comment.blog_id}/comment/`
    );
    const ref = doc(collectionRef, comment.id);
    // updateDoc(ref, comment);

    // updateDoc(collectionRef, comment)
  }

  getComments(blog_id: string): Observable<Comments[]> {
    const collectionRef = collection(  this.firestore, `blog/${blog_id}/comment/` );
    const q = query(collectionRef, orderBy('created_date', 'desc'));
    const commentItems = collectionData(q, { idField: 'id',}) as Observable<Comments[]>;
    return commentItems;
  }

  getBlogImage(parentId: string): any {
    return this.imageItemIndexService.getImageByType(parentId);
  }

  getAllPublishedBlog() {
    return this.getAll().pipe(
      map((blogs) =>
        blogs.filter(
          (pub) =>
            (pub.published === true &&
              pub.calendar === false &&
              pub.tailoring === false) || pub.tailoring === undefined
        )
      )
    );
  }

  getTailoringBlog() {
    return this.getAll().pipe(
      map((blogs) =>
        blogs.filter(
          (pub) =>
            pub.tailoring === true &&
            pub.published === true &&
            pub.calendar !== true
        )
      )
    );
  }

  getCalendarBlog() {
    return this.getAll().pipe(
      map((blogs) =>
        blogs.filter((pub) => pub.calendar === true && pub.published === true)
      )
    );
  }

  getAll(): Observable<Blog[]> {
    const collectionRef = collection(this.firestore, 'blog');
    const q = query(collectionRef, orderBy('date_created', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Blog[]>;
  }

  getBlog(id: string) {
    const collectionRef = collection(this.firestore, 'blog');
    const blog = doc(collectionRef, id);
    return docData(blog) as Observable<Blog>;
  }

  findBlogByUrl(id: string): Observable<Blog | undefined> {
    const collectionRef = collection(this.firestore, 'blog');
    const blog = doc(collectionRef, id);
    return docData(blog) as Observable<Blog>;
  }

  createBlog(blog: Blog) {
    blog.published = false;
    blog.date_updated = new Date().toISOString();
    blog.date_created = new Date().toISOString();
    return addDoc(collection(this.firestore, 'blog'), blog);
  }

  update(blog: Blog) {
    blog.date_updated = new Date().toISOString();
    const ref = doc(this.firestore, 'blog', blog.id) as DocumentReference<Blog>;
    updateDoc(ref, blog);
  }

  updatePartial(blog: Blog) {
    blog.date_updated = new Date().toISOString();
    const ref = doc(this.firestore, 'blog', blog.id) as DocumentReference<Blog>;
    return updateDoc(ref, blog);
  }

  createPartial(blog: BlogPartial) {
    blog.published = false;
    blog.date_created = new Date().toISOString();
    return addDoc(collection(this.firestore, 'blog'), blog);
  }

  delete(id: string) {
    const ref = doc(this.firestore, 'blog', id);
    deleteDoc(ref);
  }
}
