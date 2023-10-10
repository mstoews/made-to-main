import { Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { CartService } from 'app/4.services/cart.service';
import { CheckoutService } from 'app/4.services/checkout.service';
import { Observable, first, Subscription } from 'rxjs';
import { Cart } from 'app/5.models/cart';
import { AuthService } from 'app/4.services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileModel } from 'app/5.models/profile';
import { AngularFirestore } from '@angular/fire/compat/firestore';


interface profile {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  postal_code: string;
  country: string;
  town: string;
  phone: string;
}

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit, OnDestroy {
  sub: Subscription;
  cart$: Observable<Cart[] | undefined>;
  userId: string;
  cartId: string;
  total: number;
  tax: number;
  shipping: number;
  grand_total: number;
  cartData: any;
  purchaseStarted: boolean;
  admin_login = false;
  cartItemsAvailable: boolean = false;
  userCountry: string;

  constructor(
    private authService: AuthService,
    private route: Router,
    private activateRoute: ActivatedRoute,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private ngxSpinner: NgxSpinnerService,
    public afs: AngularFirestore,
  ) {
    this.authService.getUserId().then ((userId) => {
      this.userId = userId
    });
  }

  async ngAfterViewInit(){
    this.userCountry = await this.getUserCountry(this.userId);
  }

  async ngOnInit(): Promise<void> {
    this.userId = this.activateRoute.snapshot.params.id;
    this.cart$ = this.cartService.cartByStatus(this.userId, 'open');

    if (this.cart$) {
      this.calculateTotals();
    }
  }

  onCheckOut() {
    // this.calculateTotals();
    // this.route.navigate(['shop/coming-soon']);
    this.ngxSpinner.show().then(() => {
      setTimeout(() => {
        this.ngxSpinner.hide();
      }, 4000);
    });

    if (this.userId !== undefined && this.cartId !== undefined) {
      this.purchaseStarted = true;
      this.checkoutService
        .startProductCheckoutSession(this.cartId)
        .subscribe((checkoutSession) => {
          this.checkoutService.redirectToCheckout(checkoutSession);
        });

      this.purchaseStarted = false;
    } else {
      this.purchaseStarted = false;
      this.route.navigate(['profile']);
    }
  }

  onCheckOutPaymentIntent() {
    // this.calculateTotals();
    // this.route.navigate(['shop/coming-soon']);
    this.ngxSpinner.show().then(() => {
      setTimeout(() => {
        this.ngxSpinner.hide();
      }, 4000);
    });

    if (this.userId !== undefined && this.cartId !== undefined) {
      this.purchaseStarted = true;
      this.checkoutService
        .startProductCheckoutSession(this.cartId)
        .subscribe((checkoutSession) => {
          this.checkoutService.redirectToCheckout(checkoutSession);
        });

      this.purchaseStarted = false;
    } else {
      this.purchaseStarted = false;
      this.route.navigate(['profile']);
    }
  }

  async getUserCountry(userId: string) {
    let userCountry = '';
    let collection = this.afs.collection<ProfileModel>( `users/${userId}/profile` );
    const profiles = collection.valueChanges({ idField: 'id' });

    await profiles.pipe(first()).subscribe((ref) => {
      if (ref.length > 0) {
        ref.forEach((mr) => {
          userCountry = mr.country
        });
      }
    });
    return userCountry;
  }


  async calculateTotals() {
    this.cartItemsAvailable = false;
    this.grand_total = 0.0;
    this.total = 0.0;
    this.cart$.subscribe((result) => {
      let total = 0.0;
      result.forEach((item) => {
        if (item.quantity === undefined) {
          item.quantity = 1;
        }
        let quantity = item.quantity;
        let pricestring = item.price * quantity;
        let price: number = +pricestring;
        total = price + total;
        this.cartId = item.id;
      });

      this.total = total;
      this.tax = Math.trunc(this.total * 0);
      this.shipping = Math.trunc(25);
      if (this.total > 500) {
        this.shipping = Math.trunc(40);
      }
      if (this.total === 0) {
        this.shipping = Math.trunc(0);
      }

      if (this.userCountry === 'Japan')
      {
       this.shipping = Math.trunc(7);
      }

      this.grand_total = this.round(this.total + this.tax + this.shipping, 2);
      if (this.grand_total > 0) {
        this.cartItemsAvailable = true;
      }
    });
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


  backToShopping() {
    this.route.navigate(['shop']);
  }

  ngOnDestroy(): void {}

  onRemoveItem(item: string) {
    this.cartService.delete(item);
    this.calculateTotals();
  }
}
