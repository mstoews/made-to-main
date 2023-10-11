import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/4.services/auth/auth.service';
import { CartService } from 'app/4.services/cart.service';

@Component({
  selector: 'purchase-thanks',
  templateUrl: './purchase-thanks.html',
  styleUrls: ['./purchase-thanks.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseThanksComponent {
  userId: string;
  purchaseFailed: boolean = false;
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private route: Router
  ) {
    this.authService.getUserId().then((userId) => {
        this.userId = userId;
        const url = new URL(window.location.href);

        if (url.searchParams.get('purchaseResult') === 'failed') {
          this.snackBar.open(
            'Purchase checkout has been cancelled by the users',
            'OK',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
          this.backToCart(this.userId);
        }
      });
  }

  ngOnInit(): void {
    const url = new URL(window.location.href);
    if (url.searchParams.get('purchaseResult') === 'failed') {
      this.purchaseFailed = true;
    }
  }

  backToShop() {
    this.route.navigate(['shop']);
  }

  backToCart(userId: string) {
    console.debug('back to cart', userId);
    this.route.navigate(['shop/cart', userId]);
  }
}
