import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Carousel, Dropdown, Sidenav, Ripple, initTE } from 'tw-elements';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
})
export class SideNavComponent implements OnInit {
  isToggle: number = 1;
  status: boolean = false;
  clickEvent() {
    this.status = !this.status;
  }

  userId: string;
  userEmail: string;
  show_admin_menu = false;
  cartCount = 0;
  side = false;

  @Output() notifyParentCloseDrawer: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentDrawerOpen: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentDrawerSide: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentDrawerOver: EventEmitter<any> = new EventEmitter();

  isAdmin$: Observable<boolean> = of(false);
  isLoggedIn$: Observable<boolean> = of(false);
  isLoggedOut$: Observable<boolean> = of(true);

  auth: Auth = inject(Auth);
  route = inject(Router);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.auth.onIdTokenChanged((user) => {
      this.isLoggedIn$ = of(true);
      this.isLoggedOut$ = of(false);
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          if (!!idTokenResult.claims.admin) {
            // Show admin UI.
            this.isAdmin$ = of(true);
          } else {
            // Show regular user UI.
            this.isAdmin$ = of(false);
          }
        });
      } else {
        // Show regular user UI.
        this.isAdmin$ = of(false);
      }
    });
  }

  ngOnInit() {
    initTE({ Carousel, Dropdown, Sidenav, Ripple });
  }

  onClose() {
    this.notifyParentCloseDrawer.emit();
  }

  setMenuMode() {
    if (this.side === true) {
      this.side = false;
      this.notifyParentDrawerOver.emit();
    } else {
      this.side = true;
      this.notifyParentDrawerSide.emit();
    }
  }

  onAdmin() {
    if (this.show_admin_menu === false) {
      this.show_admin_menu = true;
      this.notifyParentDrawerOpen.emit();
    } else {
      this.show_admin_menu = false;
      this.notifyParentCloseDrawer.emit();
      this.route.navigate(['home']);
    }
  }

  onShop() {
    this.route.navigate(['shop']);
    this.notifyParentCloseDrawer.emit();
  }

  onProfile() {
    this.route.navigate(['profile']);
    this.notifyParentCloseDrawer.emit();
  }

  onWishList() {
    if (!this.userId) {
      this.snackBar.open('Please sign in to access the wish list', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: 'bg-danger',
        duration: 3000,
      });
      this.route.navigate(['profile']);
    } else {
      this.route.navigate(['/shop/wishlist/', this.userId]);
      this.notifyParentCloseDrawer.emit();
    }
  }

  onCart() {
    if (!this.userId) {
      this.snackBar.open('Please sign in to access the cart', 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
      this.route.navigate(['profile']);
    } else {
      this.route.navigate(['/shop/cart/', this.userId]);
      this.notifyParentCloseDrawer.emit();
    }
  }
}
