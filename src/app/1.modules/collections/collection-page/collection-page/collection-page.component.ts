import {
  Component,
  inject,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { CollectionsService } from 'app/4.services/collections.service';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';


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
