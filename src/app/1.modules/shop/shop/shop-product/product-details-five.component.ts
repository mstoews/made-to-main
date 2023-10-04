import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { Product } from 'app/5.models/products';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'app/4.services/products.service';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { WishListService } from 'app/4.services/wishlist.service';
import { CartService } from 'app/4.services/cart.service';
import { AuthService } from 'app/4.services/auth/auth.service';
import { CategoryService } from 'app/4.services/category.service';
import { Category } from 'app/5.models/category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';
import { Cart } from 'app/5.models/cart';
import { MenuToggleService } from 'app/4.services/menu-toggle.service';
import { UserService } from 'app/4.services/auth/user.service';
import { Lightbox, initTE } from 'tw-elements';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-details-five',
  templateUrl: './product-details-five.component.html',
  styleUrls: ['./product-details-five.component.css'],
})
export class ProductDetailsFiveComponent implements OnInit, OnDestroy {
  purchaseStarted: boolean;
  productItem$: Observable<Product | undefined>;
  Products$: Observable<Product[]>;
  // Categories$: Observable<Category[]>;
  sub: Subscription;
  cartCount = 0;
  wishListCount = 0;
  product: Product;
  isLoggedIn$: Observable<boolean>;

  inventoryImages$: Observable<ImageItemIndex[]>;
  imagesList: string[];
  cart: Observable<Cart[]>;

  constructor(
    private route: Router,
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
    private wishlistService: WishListService,
    private productService: ProductsService,
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
  userId: String;
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

    this.userData = this.authService.userData;

    this.productIds = [];
    this.wishListIds = [];
    // this.Categories$ = this.categories.getAll();

    this.product = this.activateRoute.snapshot.data['product'];
    if (this.product.quantity == undefined) {
      this.quantity = 1;
    } else {
      this.quantity = this.product.quantity;
      this.total_cost = this.product.price * this.quantity;
    }
    this.mainImage = this.product.image;
    // console.debug('User id from cart', this.authService.userData.uid);

    if (this.authService.userData) {
      this.cartService
        .cartByUserId(this.authService.userData.uid).pipe(takeUntil(this._unsubscribeAll))
        .subscribe((cart) => {
          this.cartCount = cart.length;
          cart.forEach((item) => {
            this.productIds.push(item.product_id);
          });
        });

      this.wishlistService
        .wishListByUserId(this.authService.userData.uid)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((wishlist) => {
          this.wishListCount = wishlist.length;
          wishlist.forEach((item) => {
            this.wishListIds.push(item.product_id);
          });
        });
    }
    this.inventoryImages$ = this.imageItemIndexService.getAllImages( this.product.id);
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
      return item === this.product.id
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
      return item === this.product.id
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

    this.userService.isLoggedIn$.subscribe((user) => {
      this.loggedIn = user;
      if (this.loggedIn === true) {
        inWishList = this.existsInWishList();
        if (inWishList === false) {
          inCart = this.existsInCart();
        }
        if (inCart === false) {
          this.wishlistService.createWishList(this.product.id);
          this.wishListIds.push(this.product.id);
        }
      } else {
        this.route.navigate(['/profile']);
      }
    });
  }

  onAddToShoppingCart() {
    let inCart: Boolean;
    this.userService.isLoggedIn$.subscribe((user) => {
      this.loggedIn = user;
      if (this.loggedIn === true) {
        inCart = this.existsInCart();
        if (inCart === false) {
          this.wishlistService.addToCart(this.product.id, this.quantity);
          this.productIds.push(this.product.id);
        }
      } else {
        this.route.navigate(['/profile']);
      }
    });
  }

  onContinueShopping() {
    this.route.navigate(['/shop']);
  }

  onGoShoppingCart() {
    if (this.cartCount > 0) {
      this.route.navigate(['shop/cart', this.authService.userData.uid]);
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
