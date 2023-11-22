import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Collection } from '../models/collection';
import { Observable } from 'rxjs';
import { CollectionsService } from './collections.service';

@Injectable()
export class CollectionResolver {
  constructor(private collectionService: CollectionsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Collection | undefined> {
    const id = route.paramMap.get('id') as string;
    const collection = this.collectionService.findCollectionByUrl(id);
    return collection;
  }
}
