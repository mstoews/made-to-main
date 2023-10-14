import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/4.services/auth/auth.service';
import { UserService } from 'app/4.services/auth/user.service';
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

  constructor(
    private auth: Auth,
    public authService: AuthService,
    public userService: UserService,
    public snackBar: MatSnackBar,
    private route: Router,

  ) {
     auth.onAuthStateChanged((user) => {
        this.userEmail = user.email!;
        this.userId = user.uid!;
      });
  }

  ngOnInit() {
    initTE({ Carousel, Dropdown, Sidenav, Ripple });
    this.userId = this.userService.getUserId();
  }


  onClose() {
    // if (this.side === true) {
      this.notifyParentCloseDrawer.emit();
    //}
  }


  setMenuMode(){
    if (this.side === true) {
      this.side = false;
      this.notifyParentDrawerOver.emit();
    }
    else {
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
