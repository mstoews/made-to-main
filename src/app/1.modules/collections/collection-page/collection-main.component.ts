import { Component, OnInit, inject } from '@angular/core';
import { CollectionsService } from 'app/4.services/collections.service';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';
import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Collection } from 'app/5.models/collection';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { ActivatedRoute } from '@angular/router';

interface collectionData {
  collection: Collection;
  ImageItemIndex: ImageItemIndex[];
}

@Component({
  selector: 'app-collection-main',
  templateUrl: './collection-main.component.html'
})
export class CollectionMainComponent implements OnInit {
  Title = '';
  Description = '';
  imageItemIndexService = inject(ImageItemIndexService);
  collectionService = inject(CollectionsService);
  activateRoute = inject(ActivatedRoute);
  allCollections$ = this.collectionService.getAll();
  collection: Collection;
  data$: Observable<collectionData>;
  collectionImages$: Observable<ImageItemIndex[]>;
  collectionId: string;

  // this.products$ = this.productService.getInventoryByCategory(this.category);

  ngOnInit(): void {
    var id: string;
    this.collection = this.activateRoute.snapshot.data['collection'];
    console.debug("Collection", this.collection);
    this.collectionImages$ = this.imageItemIndexService.getAllImages(this.collection.id);
  }

}
