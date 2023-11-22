import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { CartService } from 'app/services/cart.service';
import { CheckoutService } from 'app/services/checkout.service';
import { Observable, first, Subscription } from 'rxjs';
import { Cart } from 'app/models/cart';
import { AuthService } from 'app/services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ProfileService } from 'app/services/profile.service';
import { Auth } from '@angular/fire/auth';

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
  purchaseStarted: boolean;
  admin_login = false;
  cartItemsAvailable: boolean = false;
  measurmentsVerified: boolean = true;
  userCountry: string;
  fg: FormGroup;
  cartItems: Cart[] = [];

  auth: Auth = inject(Auth);

  constructor(

    private route: Router,
    private activateRoute: ActivatedRoute,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private ngxSpinner: NgxSpinnerService,
    // private profileService: ProfileService,
    public fb: FormBuilder
  ) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  async ngAfterViewInit() {
    // this.userCountry = await this.getUserCountry();
  }

  async ngOnInit(): Promise<void> {
    this.cartService.cartByStatus(this.userId, 'open').subscribe((cart) => {
      this.cartItems = cart;
      this.calculateTotals();
      this.createForm();
    });

    this.cartService.getCartCountByUser(this.userId).then((count) => {
      console.debug('count there: ', count);
    });
  }

  onRemoveItem(id: string) {
    this.cartService.delete(this.userId, id);
    this.calculateTotals();
  }

  onCheckOut() {
    // this.calculateTotals();
    // this.route.navigate(['shop/coming-soon']);

    if (this.onSaveMeasurements() === false) {
      return;
    }

    this.onSaveCartToUser(this.userId);

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

  async onSaveCartToUser(userId: string) {
    // const email = this.profileService.getUserEmail();
    // const userName = await this.profileService.getUserName();
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const cart = {
      ...this.cartItems,
      user: 'User Name',
      // email: email,
      is_completed: false,
      user_purchased: userId,
      date_sold: updateDate,
      date_updated: updateDate,
      status: 'open',
      is_measurement_saved: true,
    };
    this.cartService.updateUserPurchases(cart);
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
        .startPaymentIntent(this.cartId)
        .subscribe((checkoutSession) => {
          this.checkoutService.redirectToCheckout(checkoutSession);
        });
      this.onSaveCartToUser(this.userId);
      this.purchaseStarted = false;
    } else {
      this.purchaseStarted = false;
      this.route.navigate(['profile']);
    }
  }

  async getUserCountry() {
    //return this.profileService.getUserCountry(this.userId);
  }

  async getUserName() {
    //return this.profileService.getUserName(this.userId);
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

  async calculateTotals() {
    this.cartItemsAvailable = false;
    this.grand_total = 0.0;
    this.total = 0.0;
    let total = 0.0;
    this.cartItems.forEach((item) => {
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

    if (this.userCountry === 'Japan') {
      this.shipping = Math.trunc(7);
    }

    this.grand_total = this.round(this.total + this.tax + this.shipping, 2);
    if (this.grand_total > 0) {
      this.cartItemsAvailable = true;
    }
  }

  onSaveMeasurements() {
    let validation = true;
    const measurements = this.fg.getRawValue();
    this.cartItems.forEach((item) => {
      item.bust = measurements.bust;
      item.waist = measurements.waist;
      item.hip = measurements.hip;
      item.height = measurements.height;
      item.inseam = measurements.inseam;
      item.outseam = measurements.outseam;
      item.sleeve_length = measurements.sleeve_length;

      if (this.validateMeasurements(item) === false) {
        validation = false;
      } else {
        validation = true;
        if (item.is_clothing === false) {
          this.cartService.updateByCartId(this.userId, item, item.id);
          // this.cartService.updateUserPurchases(item);
        }
      }
    });
    if (!validation) {
      alert('Please fill in all the measurements');
    }
    return validation;
  }

  createEmptyForm() {
    this.fg = this.fb.group({
      bust: ['', Validators.required],
      waist: ['', Validators.required],
      hip: ['', Validators.required],
      height: ['', Validators.required],
      inseam: ['', Validators.required],
      outseam: ['', Validators.required],
      sleeve_length: ['', Validators.required],
    });
  }

  validateMeasurements(item: any): boolean {
    let form_completed = true;
    if (item.is_tailoring === true) {
      if (
        item.bust === '' ||
        item.bust === null ||
        item.bust === undefined ||
        item.bust === 0
      ) {
        form_completed = false;
      }
      if (
        item.waist === '' ||
        item.waist === null ||
        item.waist === undefined ||
        item.waist === 0
      ) {
        form_completed = false;
      }
      if (
        item.hip === '' ||
        item.hip === null ||
        item.hip === undefined ||
        item.hip === 0
      ) {
        form_completed = false;
      }
      if (
        item.height === '' ||
        item.height === null ||
        item.height === undefined ||
        item.height === 0
      ) {
        form_completed = false;
      }
      if (
        item.inseam === '' ||
        item.inseam === null ||
        item.inseam === undefined ||
        item.inseam === 0
      ) {
        form_completed = false;
      }
      if (
        item.outseam === '' ||
        item.outseam === null ||
        item.outseam === undefined ||
        item.outseam === 0
      ) {
        form_completed = false;
      }
      if (
        item.sleeve_length === '' ||
        item.sleeve_length === null ||
        item.sleeve_length === undefined ||
        item.sleeve_length === 0
      ) {
        form_completed = false;
      }
    } else if (item.is_coats_tops) {
      if (
        item.bust === '' ||
        item.bust === null ||
        item.bust === undefined ||
        item.bust === 0
      ) {
        form_completed = false;
      }
      if (
        item.waist === '' ||
        item.waist === null ||
        item.waist === undefined ||
        item.waist === 0
      ) {
        form_completed = false;
      }
      if (
        item.height === '' ||
        item.height === null ||
        item.height === undefined ||
        item.height === 0
      ) {
        form_completed = false;
      }
      if (
        item.sleeve_length === '' ||
        item.sleeve_length === null ||
        item.sleeve_length === undefined ||
        item.sleeve_length === 0
      ) {
        form_completed = false;
      }
    } else if (item.is_trousers) {
      if (
        item.waist === '' ||
        item.waist === null ||
        item.waist === undefined ||
        item.waist === 0
      ) {
        form_completed = false;
      }
      if (
        item.hip === '' ||
        item.hip === null ||
        item.hip === undefined ||
        item.hip === 0
      ) {
        form_completed = false;
      }
      if (
        item.height === '' ||
        item.height === null ||
        item.height === undefined ||
        item.height === 0
      ) {
        form_completed = false;
      }
      if (
        item.inseam === '' ||
        item.inseam === null ||
        item.inseam === undefined ||
        item.inseam === 0
      ) {
        form_completed = false;
      }
      if (
        item.outseam === '' ||
        item.outseam === null ||
        item.outseam === undefined ||
        item.outseam === 0
      ) {
        form_completed = false;
      }
    }

    if (form_completed === false) {
      this.measurmentsVerified = false;
    } else {
      this.measurmentsVerified = true;
    }

    return form_completed;
  }

  createForm() {
    let cart: Cart;
    this.cartItems.forEach((item) => {
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
  }

  backToShopping() {
    this.route.navigate(['shop']);
  }

  ngOnDestroy(): void {}
}
