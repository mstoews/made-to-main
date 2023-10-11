import { Injectable, inject } from '@angular/core';
import { first, from, map, Observable } from 'rxjs';
import { Product } from 'app/5.models/products';
import { convertSnaps } from './db-utils';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageItemIndexService } from './image-item-index.service';
import { DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, orderBy, query, updateDoc, where } from '@angular/fire/firestore';




@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  [x: string]: any;

  imageItemIndexService: ImageItemIndexService = inject(ImageItemIndexService);
  firestore = inject(Firestore);
  snakBar = inject(MatSnackBar);


    //Query

    getAll() {
      const collectionRef = collection(this.firestore, 'inventory');
      return collectionData(collectionRef, { idField: 'id' }) as Observable<Product[]>;
    }

    getById(id: string) {
      const collectionRef = collection(this.firestore, 'inventory');
      const ref = doc(collectionRef, id);
      return docData(ref) as Observable<Product>;
    }

    getProductList() {
      return this.getAll().pipe(
        map((product) =>
          product.filter((available) => available.purchases_allowed === true)
        )
      );
    }

    // Add
    add(product: Product) {
      return addDoc(collection(this.firestore, 'inventory'), product);
    }

    // Update

    update(product: Product) {
      const ref = doc(
        this.firestore,
        'inventory',
        product.id
      ) as DocumentReference<Product>;
      return updateDoc(ref, product);
    }

    // Delete
    delete(id: string) {
      const ref = doc(this.firestore, 'product', id);
      return deleteDoc(ref);
    }

  createPartial(productPartial: Product) {
    this.add(productPartial);
  }

  getAvailableInventory() {
    return this.getAll().pipe(
      map((inventory) =>
        inventory.filter((available) => available.purchases_allowed === true)
      )
    );
  }

  updateMainImage(product: Product) {
    this.update(product);
    this.snackBar.open('Main image updated', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'bg-danger',
      duration: 2000,
    });
  }

  deleteEmptyInventory() {
    alert('delete empty Inventory not used');
    // const allInventory = this.afs.collection<Product>('inventory');
    // const allItems = allInventory.valueChanges();
    // allItems.pipe(
    //   map((inventory) => {
    //     inventory.map((items) => {
    //       if (items.description === undefined) {
    //         console.debug(items.id);
    //       }
    //     });
    //   })
    // );
  }

  get(id: string) {
    return this.getById(id);
  }

  getInventoryByProduct(category: string) {
    if (category === 'All Categories' || category === null) {
      return this.getAvailableInventory();
    } else {
      return this.getAvailableInventory().pipe(
        map((inventory) =>
          inventory.filter((product) => product.category === category)
        )
      );
    }
  }

  getInventoryByCategory(category: string) {
    if (category === null) {
      return this.getAvailableInventory();
    } else {
      return this.getAvailableInventory().pipe(
        map((inventory) =>
          inventory.filter((product) => product.category === category)
        )
      );
    }
  }

  getProductImage(parentId: string): any {
    const productImages = this.imageItemIndexService.getImagesByTypeId(parentId);
    return productImages.pipe(
      map((images) => images.filter((product) => product.parentId === parentId))
    );
  }

  getImageList() {
    const collectionRef = collection(this.afs, 'originalImageList');
    const q = query(collectionRef, orderBy('ranking'));
    return collectionData(q, { idField: 'id' }) as Observable<ImageItemIndex[]>;
  }

  async getImageListByProduct(type: string) {
    if (type === null || type === undefined || type === '') {
      return this.getImageList();
    }
    else {
      return this.getImageList().pipe(map((images) => images.filter((types) => types.type === type)));
    }
  }

  findProductByUrl(id: string): Observable<Product> {
    const collectionRef = collection(this.firestore, 'inventory');
    const q = query(collectionRef, where('id', '==', id));
    const list = collectionData(q, { idField: 'id' }) as Observable<Product[]>;
    return list.pipe(map((product) => product[0]));
  }

  create(mtProduct: Product) {
    return from(this.productsCollection.add(mtProduct));
  }

  updatePartial(product: Product) {
    this.productPartialCollection.doc(product.id.toString()).update(product);
  }

}
