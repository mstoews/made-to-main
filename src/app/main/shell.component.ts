import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { onMainContentChange } from './animations';
import { AuthService } from 'app/services/auth/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'app/services/cart.service';
import { WishListService } from 'app/services/wishlist.service';
import { MenuToggleService } from 'app/services/menu-toggle.service';
import { UserService } from 'app/services/auth/user.service';

@Component({
  selector: 'shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  animations: [onMainContentChange],
})
export class ShellComponent implements OnInit {
  loading = false;
  public onSideNavChange = false;
  showFiller = false;
  isLoggedIn: boolean;
  loggedInUser: string;

  @ViewChild('drawer', { static: true }) public drawer!: MatDrawer;
  bSideNavMenu!: boolean;
  divClicked = false;
  isClicked = false;
  doAnimation = false;
  public cartCount = 0;
  public wishCount = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private cartService: CartService,
    public userService: UserService,
    private wishListService: WishListService,
    private menuToggleService: MenuToggleService,
    public router: Router
  ) {
    this.menuToggleService.toggleDrawer.subscribe((drawer) => {
      if (drawer === true) this.openDrawer();
      else this.closeDrawer();
    });
  }

  async ngOnInit() {
    this.userService.isLoggedIn$.subscribe((res) => {
      if (res === true) {
        this.isLoggedIn = true;

        this.cartService
          .cartByStatus(this.authService.userData.uid, 'open')
          .subscribe((cart) => {
            this.cartCount = cart.length;
          });

        this.wishListService
          .wishListByUserId(this.authService.userData.uid)
          .subscribe((wishlist) => {
            this.wishCount = wishlist.length;
          });
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  doAnimate() {
    if (this.doAnimation === true) {
      this.doAnimation = false;
    }
  }

  onToggleMenu() {
    console.debug('shell: onToggleMenu');
    this.drawer.toggle();
    if (this.isClicked === false) {
      this.isClicked = true;
    } else {
      this.isClicked = false;
    }
    this.drawer.toggle();
  }

  closeDrawer() {
    this.onSideNavChange = false;
    if (this.drawer.mode === 'over') {
      this.drawer.close();
    }

    // this.drawer.mode = 'over';
  }

  openDrawer() {
    this.onSideNavChange = true;
    this.drawer.open();
    this.drawer.mode = 'over';
  }

  setDrawerSide() {
    this.onSideNavChange = true;
    if (this.drawer.mode !== 'side') {
      this.drawer.mode = 'side';
    } else {
      this.drawer.mode = 'over';
    }
    this.drawer.open();
  }

  async logout() {
    this.loading = true;
    await this.authService.SignOut();
    this.loading = false;
  }

  openShoppingCart() {
    this.router.navigate(['shop/cart', this.authService.userData.uid]);
  }

  openWishList() {
    this.router.navigate(['shop/wishlist', this.authService.userData.uid]);
  }
}
