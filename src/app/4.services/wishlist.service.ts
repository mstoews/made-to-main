import { Injectable, inject } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { first, map, Observable, throwError } from 'rxjs';
import { Product } from 'app/5.models/products';
import { convertSnaps } from './db-utils';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuToggleService } from './menu-toggle.service';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import { OrderByDirection } from 'firebase/firestore';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private wishListCollection: AngularFirestoreCollection<Product>;
  private wishListItems: Observable<Product[]>;
  private isLoggedIn: boolean;
  private userId: string;
  public cartService = inject(CartService);

  private waist: number = 0;
  private bust: number = 0;
  private height: number = 0;
  private inseam: number = 0;
  private outseam: number = 0;
  private sleeve_length: number = 0;
  private hip: number = 0;

  constructor(
    private afs: AngularFirestore,
    private snack: MatSnackBar,
    private auth: AngularFireAuth,

    private menuToggleService: MenuToggleService,
    private route: Router
  ) {
    auth.authState.subscribe((user) => {
      this.userId = user?.uid;
    });

    this.auth.authState.pipe(map((user) => !!user)).subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    if (this.isLoggedIn) {
      this.wishListItems = this.wishListCollection.valueChanges({
        idField: 'id',
      });
    }
  }

  getAll() {
    return this.wishListItems;
  }

  getCurrentUserId() {
    return this.userId;
  }

  get(id: string) {
    return this.wishListCollection.doc(id).get();
  }

  createCart(product: Product) {
    const collectionRef = this.afs.collection(`users/${this.userId}/cart/`);
    collectionRef
      .add(product)
      .then((docRef) => {
        console.debug('Document written with ID: ', docRef.id);
        this.snack.open('Selection has been added to your cart ...', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 2000,
        });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
        throwError(() => new Error(error));
      });
  }

  createWishList(productId: string) {
    let prod = this.findProductById(productId);
    if (prod) {
      prod.subscribe((result) => {
        const wish: Product = {
          ...result,
          product_id: result.id,
        };
        this.create(wish);
      });
    }
    //}
  }

  findWishListById(id: string): Observable<Product | undefined> {
    return this.afs
      .collection(`users/${this.userId}/wishlist`, (ref) =>
        ref.where('id', '==', id)
      )
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          const product = convertSnaps<Product>(snaps);
          return product.length == 1 ? product[0] : undefined;
        }),
        first()
      );
  }

  findProductById(id: string): Observable<Product | undefined> {
    return this.afs
      .collection('inventory', (ref) => ref.where('id', '==', id))
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          const product = convertSnaps<Product>(snaps);
          return product.length == 1 ? product[0] : undefined;
        }),
        first()
      );
  }

  findWishListItemById(id: string): Observable<Product | undefined> {
    return this.afs
      .collection(`users/${this.userId}/wishlist/`, (ref) =>
        ref.where('id', '==', id)
      )
      .valueChanges()
      .pipe(
        map((snaps) => {
          const wishlist = convertSnaps<Product>(snaps);
          return wishlist.length == 1 ? wishlist[0] : undefined;
        }),
        first()
      );
  }

  deleteWishListItemById(id: string): boolean {
    let collection = this.afs.collection(
      `users/${this.userId}/wishlist/`,
      (ref) => ref.where('product_id', '==', id)
    );
    const ref = collection.get();
    ref.forEach((doc) => {
      doc.forEach((item) => {
        collection.doc(item.id).delete();
        return true;
      });
    });
    return false;
  }

  findCartItemByProductId(productId: string): any {
    this.afs
      .collection(`users/${this.userId}/cart/`, (ref) =>
        ref.where('product_id', '==', productId)
      )
      .get()
      .pipe(
        map((snaps) => {
          snaps.forEach((cart) => {
            // console.debug('Found the item in the cart: ', cart.ref.id);
            return true;
          });
        })
      );
    return false;
  }

  create(mtProduct: Product): void {
    // console.debug('product id:', mtProduct.id);
    if (this.findWishListItemById(mtProduct.id)) {
      const collectionRef = this.afs.collection(
        `users/${this.userId}/wishlist/`
      );
      // create an api call to the server to create the wish list on the userId
      // if the users is not logged in create a user id from an anonymous login.
      collectionRef.add(mtProduct);
      this.snack.open('Wish list has been added ...', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
    }
  }

  isProductInCart(productId: string): boolean {
    return this.findCartItemByProductId(productId);
  }

  isProductInWishList(productId: string): boolean {
    const collectionRef = this.afs.collection(
      `users/${this.userId}/wishlist/${productId}/id`
    );
    const wishlistId = collectionRef.get();
    if (wishlistId) {
      this.snack.open('Item is already in your wishlist... ', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
      });
      return true;
    } else {
      return false;
    }
  }

  getProductInCart(productId: string, userId: string): any {
    let found = false;
    let product: Observable<Product[]>;
    let productCollection: AngularFirestoreCollection<Product>;
    productCollection = this.afs.collection<Product>(`users/${userId}/cart`);
    product = productCollection.valueChanges({ idField: 'id' });
    product.pipe(
      map((cart) =>
        cart.filter((product) => {
          product.product_id === productId;
        })
      )
    );
  }

  findCart(
    productId: string,
    userId: string,
    sortOrder: OrderByDirection = 'asc',
    pageNumber = 0,
    pageSize = 3
  ): Observable<Product[]> {
    return this.afs
      .collection(`users/${userId}/cart`, (ref) =>
        ref
          .orderBy('description', sortOrder)
          .limit(pageSize)
          .startAfter(pageNumber * pageSize)
      )
      .get()
      .pipe(map((results) => convertSnaps<Product>(results)));
  }

  addToCartWithQuantity(productId: string, quantity: number) {
    let userId = this.userId;
    let prod = this.findProductById(productId);
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    if (prod) {
      prod.subscribe((result) => {
        // get the wish item
        const product: Product = {
          ...result,
          product_id: productId,
          is_completed: false,
          user_purchased: userId,
          date_sold: updateDate,
          date_updated: updateDate,
          quantity: quantity,
          status: 'open',
        };
        // create the cart item from the list item
        this.createCart(product);
        // delete the wish item from the wish list
        this.deleteWishListItemById(productId);
        this.cartService.cartCounter.set(this.cartService.cartCounter() + 1);
      });
    }
  }

  addToCart(productId: string, quantity: number) {
    if (this.isProductInCart(productId) === false) {
      let prod = this.findProductById(productId);

      if (prod) {
        prod.subscribe((result) => {
          // if (result.quantity_required === true) {
          //   this.route.navigate(['/shop/product', productId]);
          // } else {
            const dDate = new Date();
            const updateDate = dDate.toISOString().split('T')[0];
            if (prod) {
              prod.subscribe((result) => {
                // get the wish item
                const wish: Product = {
                  ...result,
                  product_id: productId,
                  is_completed: false,
                  user_purchased: this.userId,
                  date_sold: updateDate,
                  date_updated: updateDate,
                  quantity: quantity,
                  status: 'open',
                  waist: this.waist,
                  bust: this.bust,
                  height: this.height,
                  inseam: this.inseam,
                  outseam: this.outseam,
                  sleeve_length: this.sleeve_length,
                  hip: this.hip,
                };
                // create the cart item from the list item
                this.createCart(wish);
                // delete the wish item from the wish list
                this.deleteWishListItemById(productId);
                this.cartService.cartCounter.set(
                  this.cartService.cartCounter() + 1
                );
              });
            }
          })
        // });
      }
    }
    return true;
  }

  wishListByUserId(userId: string): any {
    let col: AngularFirestoreCollection<Product>;
    col = this.afs.collection<Product>(`users/${userId}/wishlist`);
    return col.valueChanges({ idField: 'id' });
  }

  wishCountByUserId(userId: string) {
    const wishListItems = this.wishListByUserId(userId);
    return wishListItems.length;
  }

  update(mtProduct: Product) {
    this.wishListCollection.doc(mtProduct.id.toString()).update(mtProduct);
  }

  delete(mtProduct: Product) {
    this.deleteWishListItemById(mtProduct.product_id);
  }
}
