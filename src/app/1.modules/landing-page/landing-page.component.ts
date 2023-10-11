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
import { ContactService } from 'app/4.services/contact.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainPageService } from 'app/4.services/main-page.service';
import { Mainpage } from 'app/5.models/mainpage';
import { BlogService } from '../../4.services/blog.service';
import { MenuToggleService } from '../../4.services/menu-toggle.service';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';
import { CartService } from 'app/4.services/cart.service';
import { WishListService } from 'app/4.services/wishlist.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/4.services/auth/user.service';
import { AuthService } from 'app/4.services/auth/auth.service';

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
  titleMessage = '';
  // features_image = './assets/images/tailoring.jpg';
  // services_one = './assets/images/tailoring.jpg';
  // services_two = './assets/images/knitting.jpg';
  // services_three = './assets/images/repairs.jpg';
  // services_four = './assets/images/bespoke_knitting.jpg';
  // about_us = './assets/images/about.jpg';

  constructor(
    private contactService: ContactService,
    private mainPage: MainPageService,
    private router: Router,

    private fb: FormBuilder,
    private menuToggle: MenuToggleService
  ) {}

  cartService = inject(CartService);
  wishListService = inject(WishListService);

  imageItemIndexService = inject(ImageItemIndexService);
  blogService = inject(BlogService);
  userService = inject(UserService);
  authService = inject(AuthService);

  mainPage$ = this.mainPage.getAll();
  wishCounter = signal<number>(0);
  cartCounter = signal<number>(0);
  _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.userService.isLoggedIn$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res === true) {
          this.authService.getUserId().then((id) => {
              this.cartService
                .cartByUserId(id)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((cart) => {
                  this.cartCounter.set(cart.length);
                });

              this.wishListService
                .wishListByUserId(id)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((wishlist) => {
                  this.wishCounter.set(wishlist.length);
                });
            }).catch((error) => {
              console.log('Error getting user id: ', error);
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
    // console.debug(service);
    this.router.navigate(['service']);
  }

  openShoppingCart() {
    this.router.navigate(['shop/cart', this.authService.userData.uid]);
  }

  openShop() {
    this.router.navigate(['shop']);
  }

  openWishList() {
    this.router.navigate(['shop/wishlist', this.authService.userData.uid]);
  }

  onAboutUs(service: string) {
    // console.debug(service);
    this.onClickAboutUs();
  }

  // onUpdate(contact: Contact) {
  //   contact = this.contactGroup.getRawValue();
  //   this.contactService.create(contact);
  //   this.createEmptyForm();
  // }

  // createEmptyForm() {
  //   this.contactGroup = this.fb.group({
  //     id: [''],
  //     name: [''],
  //     email: [''],
  //     phone: [''],
  //     message: [''],
  //   });
  // }

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
