import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { Product } from 'app/models/products';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { WishListService } from 'app/services/wishlist.service';
import { CartService } from 'app/services/cart.service';
import { AuthService } from 'app/services/auth/auth.service';
import { CategoryService } from 'app/services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageItemIndex } from 'app/models/imageItem';
import { ImageItemIndexService } from 'app/services/image-item-index.service';
import { Cart } from 'app/models/cart';
import { MenuToggleService } from 'app/services/menu-toggle.service';
import { UserService } from 'app/services/auth/user.service';
import { Lightbox, initTE } from 'tw-elements';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { on } from 'events';

@Component({
  selector: 'app-product-details-five',
  templateUrl: './product-details-five.component.html',
  styleUrls: ['./product-details-five.component.css'],
})
export class ProductDetailsFiveComponent implements OnInit, OnDestroy {
  purchaseStarted: boolean;
  productItem$: Observable<Product | undefined>;
  Products$: Observable<Product[]>;

  sub: Subscription;
  cartCount = 0;
  wishListCount = 0;
  product: Product;
  isLoggedIn$: Observable<boolean>;

  inventoryImages$: Observable<ImageItemIndex[]>;
  imagesList: string[];
  cart: Observable<Cart[]>;

  auth: Auth = inject(Auth);

  constructor(
    private route: Router,
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
    private wishlistService: WishListService,

    private cartService: CartService,
    private categories: CategoryService,
    private snackBar: MatSnackBar,
    private menuToggleService: MenuToggleService,
    private userService: UserService,
    private imageItemIndexService: ImageItemIndexService
  ) {}

  mainImage: string;
  productIds: string[] = [];
  wishListIds: string[] = [];
  loggedIn: boolean = false;
  quantity: number = 1.0;
  total_cost: number = 0.0;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  userData: any;
  userId: string;
  fb = inject(FormBuilder);
  measurementGroup: FormGroup;

  createEmptyForm() {
    this.measurementGroup = this.fb.group({
      bust: [''],
      waist: [''],
      hips: [''],
      height: [''],
      inseam: [''],
      outseam: [''],
      sleeve_length: [''],
    });
  }

  ngOnInit(): void {
    initTE({ Lightbox });

    // change the auth service
    this.productIds = [];
    this.wishListIds = [];

    this.product = this.activateRoute.snapshot.data['product'];

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        console.debug('user logged in as : ', this.userId);

        this.product = this.activateRoute.snapshot.data['product'];

        if (this.product.quantity == undefined) {
          this.quantity = 1;
        } else {
          this.quantity = this.product.quantity;
          this.total_cost = this.product.price * this.quantity;
        }


        this.cartService
          .cartByUserId(this.userId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((cart) => {
            this.cartCount = cart.length;
            cart.forEach((item) => {
              this.productIds.push(item.product_id);
            });
          });

        this.wishlistService
          .wishListByUserId(this.userId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((wishlist) => {
            this.wishListCount = wishlist.length;
            wishlist.forEach((item) => {
              this.wishListIds.push(item.product_id);
            });
          });
      }
      this.mainImage = this.product.image;
    });

    this.inventoryImages$ = this.imageItemIndexService.getAllImages(
      this.product.id
    );
    this.menuToggleService.setCartListCount(this.productIds.length);
    this.menuToggleService.setWishListCount(this.wishListIds.length);
    this.createEmptyForm();
  }

  setImage(e: ImageItemIndex) {
    this.mainImage = e.imageSrc400;
  }

  add() {
    let quantity_increment: number;
    let quantity: number;
    if (this.product.quantity_increment) {
      quantity_increment = +this.round(this.product.quantity_increment, 1);
    }

    quantity = +this.round(this.quantity, 1);

    this.quantity = this.round(quantity, 1) + this.round(quantity_increment, 1);
    this.total_cost = this.product.price * this.quantity;

    //('quantity', this.quantity);
  }

  subtract() {
    let quantity_increment: number;
    let quantity: number;
    if (this.product.quantity_increment) {
      quantity_increment = +this.product.quantity_increment;
    }
    quantity = +this.quantity;
    this.quantity = this.round(quantity, 1) - this.round(quantity_increment, 1);
    this.total_cost = this.product.price * this.quantity;
    console.debug(
      `quantity  ${this.product.quantity} ${this.quantity} ${this.product.quantity_increment} ${quantity_increment} ${this.total_cost}`
    );
  }

  round(number: number, precision: number) {
    if (precision < 0) {
      let factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    } else
      return +(
        Math.round(Number(number + 'e+' + precision)) +
        'e-' +
        precision
      );
  }

  existsInWishList(): boolean {
    let found = this.wishListIds.find((item) => {
      return item === this.product.id;
    });
    if (found) {
      this.snackBar.open(
        'The item already exists in your wishlist ... ',
        'OK',
        {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
        }
      );
      return true;
    }
    return false;
  }

  existsInCart(): boolean {
    let found = this.productIds.find((item) => {
      return item === this.product.id;
    });
    if (found) {
      this.snackBar.open('The item already exists in your cart ... ', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
      return true;
    }
    return false;
  }

  existsInCartByItem(): boolean {
    let found = this.productIds.find((item) => {
      return item === this.product.id;
    });
    if (found) {
      this.snackBar.open('The item already exists in your cart ... ', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
      return true;
    }
    return false;
  }

  onAddToWishList() {
    let inWishList: Boolean;
    let inCart: Boolean;
    if (this.userId) {
      inWishList = this.existsInWishList();
      if (inWishList === false) {
        inCart = this.existsInCart();
      }
      if (inCart === false) {
        this.wishlistService.createWishList(this.userId, this.product.id);
        this.wishListIds.push(this.product.id);
      }
    } else {
      this.route.navigate(['/profile']);
    }
  }

  onAddToShoppingCart() {
    if (this.userId) {
      const inCart = this.existsInCart();
      if (inCart === false) {
        this.cartService.addToCartWithQuantity(
          this.userId,
          this.product.id,
          this.quantity
        );
        this.productIds.push(this.product.id);
        this.cartService.cartCount(this.userId).then((count) => {
          this.menuToggleService.setCartListCount(count);
        });
      }
    } else {
      this.route.navigate(['/profile']);
    }
  }

  onContinueShopping() {
    this.route.navigate(['/shop']);
  }

  onGoShoppingCart() {
    if (this.cartCount > 0) {
      this.route.navigate(['shop/cart', this.userId]);
    } else {
      this.snackBar.open('There are no items in your cart', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
      return;
    }
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
