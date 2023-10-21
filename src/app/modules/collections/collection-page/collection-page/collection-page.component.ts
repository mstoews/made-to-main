import { Component, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ImageItemIndex } from 'app/models/imageItem';
import { CollectionsService } from 'app/services/collections.service';
import { ImageItemIndexService } from 'app/services/image-item-index.service';

@Component({
  selector: 'collection-page',
  templateUrl: './collection-page.component.html',
  styleUrls: ['./collection-page.component.css'],
})
export class CollectionPage {
  imageItemIndexService = inject(ImageItemIndexService);
  images$: Observable<ImageItemIndex[]>;
  collectionService = inject(CollectionsService);
  collection$ = this.collectionService.getAll();
}
