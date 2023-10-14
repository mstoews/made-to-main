import { Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { CartService } from 'app/4.services/cart.service';
import { CheckoutService } from 'app/4.services/checkout.service';
import { Observable, first, Subscription } from 'rxjs';
import { Cart } from 'app/5.models/cart';
import { AuthService } from 'app/4.services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileModel } from 'app/5.models/profile';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from 'app/4.services/profile.service';


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
  fg: FormGroup;

  constructor(
    private authService: AuthService,
    private route: Router,
    private activateRoute: ActivatedRoute,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private ngxSpinner: NgxSpinnerService,
    private profileService: ProfileService,
    public fb: FormBuilder
  ) {
    this.authService.getUserId().then ((userId) => {
      this.userId = userId
    });
  }

  async ngAfterViewInit(){
    this.userCountry = await this.getUserCountry();
  }

  async ngOnInit(): Promise<void> {
    this.userId = this.activateRoute.snapshot.params.id;
    console.debug('userId: ', this.userId);
    this.cart$ = this.cartService.cartByStatus(this.userId, 'open');

    this.cart$.subscribe((cart) => {
      this.cartData = cart;
      this.calculateTotals();
      this.createForm();
    });

    this.cartService.getCartCountByUser(this.userId).then((count) => {
      console.debug('count there: ', count);
    });

  }



  onSaveMeasurements() {
    let userId = this.userId;
    let measurements = this.fg.getRawValue();
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];

    if (measurements) {
      const cart: Cart = {
        ...measurements,
        is_completed: false,
        user_purchased: userId,
        date_sold: updateDate,
        date_updated: updateDate,
        status: 'open',
        quantity: 1,
      };
      this.cartService.updateByCartId(cart, this.cartId)
    }
  }

  createEmptyForm() {
    this.fg = this.fb.group({
      bust: [''],
      waist: [''],
      hip: [''],
      height: [''],
      inseam: [''],
      outseam: [''],
      sleeve_length: [''],
    });
  }

  createForm() {
    let cart: Cart;
    this.cart$.subscribe((result) => {
      result.forEach((item) => {
        cart = item;
        if (item.is_clothing === false) {
          this.fg = this.fb.group({
            bust: [cart.bust],
            waist: [cart.waist],
            hip: [cart.hip],
            height: [cart.height],
            inseam: [cart.inseam],
            outseam: [cart.outseam],
            sleeve_length: [cart.sleeve_length],
          });
        }
      });
    });
  }

  onCheckOut() {
    // this.calculateTotals();
    // this.route.navigate(['shop/coming-soon']);
    this.onSaveMeasurements();
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
    this.onSaveMeasurements();
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

  async getUserCountry() {

    return this.profileService.getUserCountry();

    // let collection = this.afs.collection<ProfileModel>( `users/${userId}/profile` );

    // const profiles = collection.valueChanges({ idField: 'id' });

    // await profiles.pipe(first()).subscribe((ref) => {
    //   if (ref.length > 0) {
    //     ref.forEach((mr) => {
    //       userCountry = mr.country
    //     });
    //   }
    // });

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
