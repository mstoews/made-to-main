import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
} from '@angular/core';
import { Product } from 'app/models/products';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ImageItemIndex } from 'app/models/imageItem';
import { ImageItemIndexService } from 'app/services/image-item-index.service';

@Component({
  selector: 'shop-card',
  templateUrl: './shop-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopCardComponent {
  @Input() product: Product;

  router = inject(Router);

  openProductDetail() {
    this.router.navigate(['shop/product', this.product.id]);
  }
}
