import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from 'app/5.models/collection';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input() collection: Collection;
  imageListService = inject(ImageItemIndexService);
  images$: Observable<ImageItemIndex[]>;

  ngOnInit(): void {
    this.images$ = this.imageListService.getAllImages(this.collection.id);
    console.log(this.collection);
  }

  router = inject(Router);

  onOpenCollection() {
    this.router.navigate(['collections-admin/collection', this.collection.id]);
  }
}
