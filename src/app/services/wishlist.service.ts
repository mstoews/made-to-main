import { Injectable, inject } from '@angular/core';
import { first, map, Observable, throwError } from 'rxjs';
import { Product } from 'app/models/products';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuToggleService } from './menu-toggle.service';
import { OrderByDirection } from 'firebase/firestore';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { WishList } from 'app/models/wishlist';
import {
  Firestore,
  collection,
  getDoc,
  getCountFromServer,
  collectionData,
  doc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
  where,
  query,
} from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { on } from 'events';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
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
    private firestore: Firestore,
    private snack: MatSnackBar,
    private auth: Auth
  ) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.userId = user.uid;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  getAll() {
    return collectionData(
      collection(this.firestore, `users/${this.userId}/wishlist`),
      { idField: 'id' }
    ) as Observable<Product[]>;
  }

  getCurrentUserId() {
    return this.userId;
  }

  get(id: string) {
    return docData(
      doc(collection(this.firestore, `users/${this.userId}/wishlist`), id)
    ) as Observable<WishList>;
  }

  addToWishList(userId: string, productId: string) {
    let prod = this.findProductById(productId);
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];

    if (prod) {
      prod.subscribe((result) => {
        const cart: Product = {
          ...result,
          id: productId,
          is_completed: false,
          user_purchased: userId,
          date_sold: updateDate,
          date_updated: updateDate,
          status: 'open',
          quantity: 1,
        };
        this.create(userId, cart);
      });
    }
  }

  createCart(product: Product) {
    addDoc(collection(this.firestore, `users/${this.userId}/cart`), product)
      .then((newProduct) => {
        console.debug('Document written with ID: ', newProduct.id);
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

  createWishList(userId: string, productId: string) {
    let prod = this.findProductById(productId);
    if (prod) {
      prod.subscribe((result) => {
        const wish: Product = {
          ...result,
          product_id: result.id,
        };
        this.create(userId, wish);
        console.debug('wish list created for product id: ', productId);
      });
    }
    //}
  }

  findWishListById(id: string): Observable<Product | undefined> {
    const collectionRef = collection(
      this.firestore,
      `users/${this.userId}/wishlist/`
    );
    const wishlist = doc(collectionRef, id);
    return docData(wishlist) as Observable<Product>;
  }

  findProductById(id: string): Observable<Product | undefined> {
    const collectionRef = collection(this.firestore, 'inventory');
    const product = doc(collectionRef, id);
    return docData(product) as Observable<Product>;
  }

  findWishListItemById(id: string): Observable<Product | undefined> {
    const collectionRef = collection(
      this.firestore,
      `users/${this.userId}/wishlist/`
    );
    const wishlist = doc(collectionRef, id);
    return docData(wishlist) as Observable<Product>;
  }

  deleteWishListItemById(id: string): boolean {
    const collectionRef = collection(
      this.firestore,
      `users/${this.userId}/wishlist/`
    );
    deleteDoc(doc(collectionRef, id));
    return true;
  }

  findCartItemByProductId(productId: string): any {
    return collectionData(
      query(
        collection(this.firestore, `users/${this.userId}/cart`),
        where('product_id', '==', productId)
      ),
      { idField: 'id' }
    ) as Observable<Product[]>;
  }

  isProductInCart(productId: string): boolean {
    return this.findCartItemByProductId(productId);
  }

  isProductInWishList(productId: string): boolean {
    if (this.findWishListById(productId)) {
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
        this.createCart(product);
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
              this.create(this.userId, wish);
            });
          }
        });
      }
    }
    return true;
  }

  async create(userId: string, product: Product) {
    const Ref = collection(this.firestore, `users/${userId}/wishlist/`);
    addDoc(Ref, product)
      .then((newCart) => {
        updateDoc(doc(Ref, newCart.id), { id: newCart.id });
        this.snack.open('Selection has been added to your wishlist ...', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
        });
      })
      .catch((error) => {
        this.snack.open(
          `Selection has NOT been added to your wishlist ...\n${error} `,
          'OK',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
            duration: 3000,
          }
        );
      });
  }

  wishListByUserId(userId: string): any {
    const collectionRef = collection(
      this.firestore,
      `users/${userId}/wishlist/`
    );
    return collectionData(collectionRef, { idField: 'id' }) as Observable<
      Product[]
    >;
  }

  wishCountByUserId(userId: string) {
    const wishListItems = this.wishListByUserId(userId);
    return wishListItems.length;
  }

  update(mtProduct: Product) {
    const collectionRef = collection(
      this.firestore,
      `users/${this.userId}/wishlist/`
    );
    const ref = doc(collectionRef, mtProduct.id);
  }
}
