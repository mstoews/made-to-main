import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';

import { Router, RouterLink, RouterModule } from '@angular/router';
import { onMainContentChange } from '../animations';
import { Location } from '@angular/common';
import { MenuToggleService } from 'app/4.services/menu-toggle.service';
import { AuthService } from 'app/4.services/auth/auth.service';
import { CartService } from 'app/4.services/cart.service';
import { WishListService } from 'app/4.services/wishlist.service';
import { ProfileService } from 'app/4.services/profile.service';
import { ProfileModel } from 'app/5.models/profile';
import { UserService } from 'app/4.services/auth/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, Subscription, first, takeUntil } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [onMainContentChange],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  country: string;
  constructor() {}

  private _router = inject(Router);
  private menuToggle = inject(MenuToggleService);
  public userService = inject(UserService);
  public cartService = inject(CartService);
  public wishListService = inject(WishListService);
  private snackBar = inject(MatSnackBar);
  private _location = inject(Location);
  private auth : Auth = inject(Auth);

  @Input() title: string;
  @Input() sub_title: string;
  @Input() back = true;
  @Input() home: boolean;
  isClicked = false;
  emailName: string;
  profile$: Observable<ProfileModel[]>;
  userId: string;

  isLoggedIn = true;
  wishCounter = signal<number>(0);
  cartCounter = signal<number>(0);

  _unsubscribeAll: Subject<any> = new Subject<any>();

  @Output() notifyNavBarToggleMenu: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.menuToggle.setDrawerState(false);
    this.emailName = 'Guest';
    this.isLoggedIn = false;

    onAuthStateChanged(this.auth, (user) => {
      this.userId = user.uid;
      this.isLoggedIn = true;
      console.debug(this.userId);
      this.cartService.cartByUserId(user.uid)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cart) => {
        this.cartCounter.set(cart.length);
      });

      this.wishListService
        .wishListByUserId(user.uid)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((wishlist) => {
          this.wishCounter.set(wishlist.length);
        });
    });
    /*

     this.authService.afAuth.authState.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        console.debug(this.userId);

        let collection = this.afs.collection<ProfileModel>(
          `users/${this.userId}/profile`
        );
        const profiles = collection.valueChanges({ idField: 'id' });

        profiles.pipe(first()).pipe(takeUntil(this._unsubscribeAll)).subscribe((ref) => {
          if (ref.length > 0)
            ref.forEach((mr) => {
              console.debug(mr);
              // this.emailName = mr.first_name.charAt(0) + mr.last_name.charAt(0);
              this.emailName = mr.first_name;
              this.country = mr.country;
              this.authService.setUserName(mr.first_name);
            });
          else {
            this.emailName = 'Guest';
            this.authService.setUserName(this.emailName);
          }
        });
        this.emailName = 'Guest';
        this.authService.setUserName('');
      } else {
        this.emailName = 'Guest';
        this.authService.setUserName('');
      }
    });
    */
  }

  public onToggleSideNav() {
    this.menuToggle.setDrawerState(true);
    this.notifyNavBarToggleMenu.emit();
  }

  onLogout() {
    this._router.navigate(['/authentication/signout/modern']);
  }
  onLogin() {
    this._router.navigate(['/authentication/signin/modern']);
  }

  onProfile() {
    this._router.navigate(['/profile']);
  }

  onThoughts() {
    this._router.navigate(['/blog']);
  }
  onCollections() {
    this._router.navigate(['/collections']);
  }

  onBack() {
    this._location.back();
  }

  public onHome() {
    this._router.navigate(['/home']);
  }

  onShop() {
    this._router.navigate(['/shop']);
  }

  doAnimate() {}

  openShoppingCart() {
    this.userService.isLoggedIn$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
      if (user === false) {
        this.snackBar.open('Please sign in to access the cart', 'Ok', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
        });
        this._router.navigate(['profile']);
      } else {
        this._router.navigate(['shop/cart', this.userId]);
      }
    });
  }



  openWishList() {
    this.userService.isLoggedIn$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user) => {
      if (user === false) {
        this.snackBar.open('Please sign in to access the wish list', 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'bg-danger',
          duration: 3000,
        });
        this._router.navigate(['profile']);
      } else {
        console.debug('User ID: ' + this.userId);
        this._router.navigate(['shop/wishlist', this.userId]);
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
