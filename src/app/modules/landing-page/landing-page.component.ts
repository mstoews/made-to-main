import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { MainPageService } from 'app/services/main-page.service';
import { Mainpage } from 'app/models/mainpage';
import { BlogService } from '../../services/blog.service';
import { MenuToggleService } from '../../services/menu-toggle.service';
import { ImageItemIndexService } from 'app/services/image-item-index.service';
import { CartService } from 'app/services/cart.service';
import { WishListService } from 'app/services/wishlist.service';
import { Subject, takeUntil } from 'rxjs';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styles: ['.scroll-to-top {position: fixed}'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.2s ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  // public topCollection: imageItem[] = [];
  // public bottomCollection: imageItem[] = [];

  contactGroup: FormGroup;
  mainPageDoc: Mainpage;
  userId: string;
  titleMessage = '';
  emailName = 'Guest';
  isLoggedIn = false;

  cartService = inject(CartService);
  wishListService = inject(WishListService);
  mainPage = inject(MainPageService);
  menuToggle = inject(MenuToggleService);
  router = inject(Router);
  imageItemIndexService = inject(ImageItemIndexService);
  blogService = inject(BlogService);
  auth = inject(Auth);

  mainPage$ = this.mainPage.getAll();
  wishCounter = signal<number>(0);
  cartCounter = signal<number>(0);
  _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.menuToggle.setDrawerState(false);
    this.emailName = 'Guest';
    this.isLoggedIn = false;

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
      this.userId = user.uid;
      this.isLoggedIn = true;
      console.debug(this.userId);
      this.cartService
        .cartByUserId(user.uid)
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
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  @Output() notifyNavBarToggleMenu: EventEmitter<any> = new EventEmitter();

  onMenuToggle() {
    this.menuToggle.setDrawerState(true);
    this.notifyNavBarToggleMenu.emit();
  }

  onMadeToTailoring() {
    this.router.navigate(['blog/tailoring']);
  }

  onLastestBlog() {
    this.blogService.getAllPublishedBlog().subscribe((blog) => {
      if (blog.length > 0) {
        this.router.navigate(['blog/detail', blog[0].id]);
        return;
      } else {
        this.router.navigate(['blog']);
      }
    });
  }

  onService() {
    this.router.navigate(['home/services']);
  }

  onFollowing() {
    this.router.navigate(['home/following']);
  }

  onServices(service: string) {
    this.router.navigate(['service']);
  }

  openShoppingCart() {
    this.router.navigate(['shop/cart', this.userId]);
  }

  openShop() {
    this.router.navigate(['shop']);
  }

  openWishList() {
    this.router.navigate(['shop/wishlist', this.userId]);
  }

  onAboutUs(service: string) {
    // console.debug(service);
    this.onClickAboutUs();
  }

  onClickAboutUs() {
    this.router.navigate(['home/about_us']);
  }

  onContactUs() {
    this.router.navigate(['home/contacts']);
  }

  scrollToId(id: string) {
    //this.scrollTo.scrollToElementById(id);
  }

  onFeatured() {
    this.router.navigate(['collections-admin/collections']);
  }

  populateImageList() {
    let imageCount = 0;
  }
}
