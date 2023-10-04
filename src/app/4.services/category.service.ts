import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, Subscription, map } from 'rxjs';
import { Category } from 'app/5.models/category';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService implements OnDestroy{
  private sub: Subscription;
  private hashSub: Subscription
  private catSub: Subscription

  productsService = inject(ProductsService);
  afs = inject(AngularFirestore);

  categoryCollection = this.afs.collection<Category>('category');
  categoryItems = this.categoryCollection.valueChanges({ idField: 'id', });

  ngOnDestroy(): void {
    if (this.sub !== undefined)
      this.sub.unsubscribe();
    if (this.hashSub !== undefined)
    this.hashSub.unsubscribe();
    if (this.catSub !== undefined)
      this.catSub.unsubscribe();
  }

  auth = inject(AngularFirestore);

  hashUsedCategoryMap = new Map<string, string>();


  // use this function ot limit the category list to only those that have products.
  updateIsUsedCategoryList() {

    // load all the current categories into a map
    this.hashSub = this.getCategoryList().subscribe((category) => {
      category.forEach((doc) => {
        this.hashUsedCategoryMap.set(doc.name, doc.name);
      });
    });

    // load all the current products into a map
    this.sub = this.productsService.getAvailableInventory().subscribe((inventory) => {
      inventory.forEach((item) => {
        if (item.category !== undefined) {
          if(this.hashUsedCategoryMap.has(item.category) === false)
              this.hashUsedCategoryMap.set(item.category, item.category);
        }
     });

    // Add all categories item if it does not exist
    if (this.hashUsedCategoryMap.has('All Categories') === false) {
        this.hashUsedCategoryMap.set('All Categories', 'All Categories');
    }


    // Update valid, used categories
    this.catSub = this.categoryCollection.get().subscribe((category) => {
        category.docs.forEach((doc) => {
          const categoryItem = doc.data() as Category;
          if (this.hashUsedCategoryMap.has(categoryItem.name)) {
            categoryItem.isUsed = true;
            this.categoryCollection.doc(categoryItem.id).update(categoryItem);
          } else {
            categoryItem.isUsed = false;
            this.categoryCollection.doc(categoryItem.id).update(categoryItem);
          }
        });
      });
    });
  }

  getAll() {
    return this.categoryItems;
  }

  getCategoryList() {
    return this.getAll().pipe(
      map((category) =>
        category.filter((available => available.isUsed === true) )));
  }

  create(category: Category) {
    this.categoryCollection.add(category);
  }

  update(category: Partial<Category>) {
    this.categoryCollection.doc(category.id).update(category);
  }

  delete(id: string) {
    this.categoryCollection.doc(id).delete();
  }


}
