import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { first, map, Observable, of, Subject, takeUntil, throwError } from 'rxjs';
import { Cart } from 'app/5.models/cart';
import { Product } from 'app/5.models/products';
import { convertSnaps } from './db-utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth/auth.service';
import { WishList } from 'app/5.models/wishlist';
import { WishListService } from './wishlist.service';
import {
  doc,
  docData,
  DocumentReference,
  getCountFromServer,
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

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {
  // private cartCollection: AngularFirestoreCollection<Cart>;
  isLoggedIn: boolean;
  userId: string;
  cart$: Observable<Cart[]>;
  cartItems$: Observable<Cart[]>;
  userCountry: string;
  // Manage state with signals
  cartItem = signal<Cart[]>([]);

  cartCounter = signal<number>(0);

  constructor(
    public afs: Firestore,
    public auth: Auth,
    public authService: AuthService,
    private snack: MatSnackBar
  ) {

    // auth.authState.subscribe((user) => {
    //   this.userId = user?.uid;
    // });

    // this.auth.authState.pipe(map((user) => !!user)).subscribe((isLoggedIn) => {
    //   this.isLoggedIn = isLoggedIn;
    // });

    // if (this.isLoggedIn === true) {
    //   this.cartItems$ = this.cartCollection.valueChanges({ idField: 'id' });
    // }

  }

  wishListService = inject(WishListService);
  firestore: Firestore = inject(Firestore);

  updateCartCounter(userId: string) {
    this.cartByStatus(userId,'open').pipe(takeUntil(this._unsubscribeAll)).subscribe((cart) => {
    console.debug('cart length:', cart.length);
    });
  }

  async cartCount(): Promise<number>  {
    const count = await getCountFromServer(collection(this.firestore ,`users/${this.userId}/cart/`));
    console.log('count: ', count.data.length);
    return count.data.length;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

  }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // getCartCount(userId: string): Observable<number | undefined> {

  //   collection(this.firestore, `users/${userId}/cart`)
  //     .snapshotChanges()
  //     .forEach((snaps) => {
  //        return of(snaps.length);
  //     }
  //   );
  //   return of(0);
  // }

  // getCartItem(userId: string, productId: string): Observable<Cart[]> {
  //   return this.afs
  //     .collection(`users/${userId}/cart`, (ref) =>
  //       ref.where('product_id', '==', productId)
  //     )
  //     .snapshotChanges()
  //     .pipe(
  //       map((snaps) => {
  //         return convertSnaps<Cart>(snaps);
  //       })
  //     );
  // }

  getAll(userId: string) {
    return  collectionData(collection(this.firestore, `user/${userId}/cart`), {idField:  'id'}) as  Observable<Cart[]>
  }

  get(id: string, userId: string) {
    return getDoc(doc(this.firestore, `user/${userId}/cart/${id}`));
  }

  cartByUserId(userId: string): Observable<Cart[] | undefined> {
    return  collectionData(collection(this.firestore, `user/${userId}/cart`), {idField:  'id'}) as  Observable<Cart[]>
  }

  cartByStatus(userId: string, cartStatus: string) {
    return collectionData(collection(this.firestore, `user/${userId}/cart`), {idField:  'id'})
    .pipe(map((cart) => cart.filter((status) => status.status === cartStatus))) as  Observable<Cart[]>
  }

  cartCountByUserId(userId: string): any {
    const cartCount = this.cartByStatus(userId, 'Open');
    cartCount.subscribe((cart) => {
      return of(cart.length);
    });
  }

  // findCartByUrl(id: string): Observable<Cart | undefined> {
  //   return this.afs
  //     .collection('cart', (ref) => ref.where('id', '==', id))
  //     .snapshotChanges()
  //     .pipe(
  //       map((snaps) => {
  //         const Cart = convertSnaps<Cart>(snaps);
  //         return Cart.length == 1 ? Cart[0] : undefined;
  //       }),
  //       first()
  //     );
  // }

  public create(Cart: Product) {
    const Ref = collection(this.firestore, `users/${this.userId}/cart/`);
    addDoc(Ref, Cart).then((newCart) => {
        Cart.id = newCart.id;
        // this.updateCart(Cart);
        this.snack.open('Selection has been added to your cart ...', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
          });
     });
  }


  findProductById(id: string): Observable<Product | undefined> {
    const ref = collection(this.firestore, `inventory`)
    return docData(doc(ref, id)) as Observable<Product | undefined>;
  }

  addToCart(productId: string) {
    let userId = this.userId;
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
        this.create(cart);
      });
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
        const wish: Product = {
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
        this.create(wish);
        // delete the wish item from the wish list
        this.wishListService.deleteWishListItemById(productId);
        this.cartCounter.set(this.cartCounter() + 1);
      });
    }
  }

  update(mtCart: Cart) {
    const collectionRef = collection(this.firestore, `user/${this.userId}/cart`);
    const ref = doc(collectionRef, mtCart.id);
    this.snack.open('Cart has been updated ... ', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'bg-danger',
    });
  }

  delete(id: string) {
    const ref = doc(this.firestore, `user/${this.userId}/cart`, id);
    deleteDoc(ref).then(() => { ;
    this.snack.open('Item has been removed ... ', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'bg-danger',
      duration: 2000
    });
    }).catch((error) => {
      this.snack.open('Item has NOT been removed ... ', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 2000
      });
    });
  }

}
