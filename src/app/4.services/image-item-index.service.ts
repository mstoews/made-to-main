import { Injectable, OnDestroy, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { Subscription, map } from 'rxjs';
import { DeleteDuplicateService } from './delete-duplicate.service';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class ImageItemIndexService implements OnDestroy{

  afs = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  dup = inject(DeleteDuplicateService)
  inventory = inject(ProductsService);
  private sub: Subscription;

  hashUsedImagesMap = new Map<string, ImageItemIndex>();
  hashOriginalIndexMap = new Map<string, ImageItemIndex>();
  hashImageItemMap = new Map<string, ImageItemIndex>();

  itemsCollection = this.afs.collection<ImageItemIndex[]>('originalImageList',
    (ref) => ref.orderBy('ranking')
  );

  imageItems = this.itemsCollection.valueChanges({ idField: 'id' });

  imageIndexCollections = this.afs.collection<ImageItemIndex>(
    'originalImageList',
    (ref) => ref.orderBy('ranking')
  );

  imageIndexItems = this.imageIndexCollections.valueChanges({ idField: 'id' });

  createOriginalItem(image: ImageItemIndex) {
    this.imageIndexCollections.add(image).then((imgIndex) => {
      this.imageIndexCollections.doc(imgIndex.id).update(imgIndex);
    });
  }

  updateProductItems() {

    // this.sub = this.inventory.getAll().subscribe((products) => {
    //   products.forEach((product) => {
    //     this.getAllImages(product.id).forEach((images) => {
    //       images.forEach((image) => {
    //         image.category = 'IN_PRODUCTS';
    //         this.imageIndexCollections.doc(image.id).update(image);
    //       });
    //     });
    //   });
    // });

    // this.getAllImages('IN_COLLECTION').forEach((images) => {
    //   images.forEach((image) => {
    //     image.category = 'IN_COLLECTION';
    //     this.imageIndexCollections.doc(image.id).update(image);
    //   });
    // });

    // this.getAllImages('IN_INVENTORY').forEach((images) => {
    //   images.forEach((image) => {
    //     image.category = 'IN_NOT_USED';
    //     image.type = 'IN_NOT_USED';
    //     this.imageIndexCollections.doc(image.id).update(image);
    //   });
    // });

    // this.getAllImages('IN_GALLERY').forEach((images) => {
    //   images.forEach((image) => {
    //     image.category = 'IN_GALLERY';
    //     this.imageIndexCollections.doc(image.id).update(image);
    //   });
    // });

    // this.getAllImages('IN_FEATURED').forEach((images) => {
    //   images.forEach((image) => {
    //     image.category = 'IN_COLLECTION';
    //     image.type = 'IN_COLLECTION';
    //     this.imageIndexCollections.doc(image.id).update(image);
    //   });
    // });

    // this.getAllImages('IN_INVENTORY').forEach((images) => {
    //   images.forEach((image) => {
    //     image.category = 'IN_NOT_USED';
    //     this.imageIndexCollections.doc(image.id).update(image);
    //   });
    // });

  }


  reNumber(type: string) {
    let ranking = 0;
    this.sub = this.getAllImages(type).subscribe((images) => {
      images.forEach((image) => {
        image.ranking = ranking;
        ranking++;
        this.imageIndexCollections.doc(image.id).update(image);
      });
    });
  }

  ngOnDestroy(): void {
    if(this.sub !== undefined){
      this.sub.unsubscribe();
    }
  }

  async getImagesByType(productId: string) {
    return this.getImageByType(productId);
  }

  updateCollectionDescription(imgItem: ImageItemIndex) {
    this.imageIndexCollections.doc(imgItem.id).update(imgItem);
  }

  setCollectionDescription(imgItem: ImageItemIndex) {
    this.imageIndexCollections.doc(imgItem.id).set(imgItem);
  }

  async getImageIndexList() {
    return this.imageIndexItems;
  }

  async sortNotUsed() {
    return (await this.getOriginalImageListByType('IN_NOT_USED')).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.caption < b.caption ? -1 : 1;
        });
        return data;
      })
    );
  }

  getAllImages(type: string) {
    if (type === null || type === undefined || type === '') {
      let imageIndexCollections = this.afs.collection<ImageItemIndex>(
        'originalImageList',
        (ref) => ref.orderBy('ranking')
      );
      let imageIndexItems = imageIndexCollections.valueChanges({
        idField: 'id',
      });
      return imageIndexItems;
    } else {
      let imageIndexCollections = this.afs.collection<ImageItemIndex>(
        'originalImageList',
        (ref) => ref.orderBy('ranking')
      );
      let imageIndexItems = imageIndexCollections
        .valueChanges({ idField: 'id' })
        .pipe(map((images) => images.filter((types) => types.type === type)));
      return imageIndexItems;
    }
  }

  getImagesByTypeId(id: string) {
    this.imageIndexItems.pipe( map((images) => images.filter((type) => type.type === id)));
  }


  async getImageByType(type: string) {
    return (await this.getImageIndexList()).pipe(
      map((images) => images.filter((image) => image.type === type))
    );
  }

  async getImagesByCategory(category: string) {
    return (await this.getImageIndexList()).pipe(
      map((images) => images.filter((image) => image.category === category))
    );
  }


  async getOriginalImageListByType(type: string) {
    return (await this.getImageIndexList()).pipe(
      map((images) => images.filter((image) => image.type === type))
    );
  }

  async createOriginalIndexMaps(): Promise<void> {
    this.hashOriginalIndexMap.clear();
    this.getAllImages('').subscribe((images) => {
      images.forEach((image) => {
        this.hashOriginalIndexMap.set(image.fileName, image);
      });
    });
  }

  getUsedImagesList() {
    return this.imageIndexItems.pipe(
      map((images) => images.filter((type) => type.type !== 'IN_NOT_USED'))
    );
  }

  updateImageList(item: ImageItemIndex) {
    this.imageIndexCollections.doc(item.id).update(item);
  }

  delete(id: string) {
    this.imageIndexCollections.doc(id).delete();
  }

  async updateUsedImageList(): Promise<void> {
    this.hashUsedImagesMap.forEach((value, key) => {
      var fileExt = value.imageAlt.split('.').pop();
      let fileName = value.imageAlt.replace(/\.[^/.]+$/, '');
      fileName = fileName.replace(`thumbnails/`, '').replace(`_200x200`, '');
      fileName = fileName.replace(`400/`, '').replace(`_400x400`, '');
      fileName = fileName.replace(`800/`, '').replace(`_800x800`, '');
      fileName = `${fileName}.${fileExt}`;
      let usedItem = this.hashOriginalIndexMap.get(fileName);
      if (usedItem !== undefined) {
        usedItem.type = value.type;
        usedItem.caption = value.caption;
        usedItem.ranking = value.ranking;
        usedItem.parentId = value.parentId;
        usedItem.imageSrc = value.imageSrc;
        this.imageIndexCollections.doc(usedItem.id).update(usedItem);
      }
    });
  }

  async updateMainImageList(): Promise<void> {
    let ranking = 0;
    this.storage
      .ref('/')
      .listAll()
      .subscribe((files) => {
        files.items.forEach((imageRef) => {
          imageRef.getDownloadURL().then((downloadURL) => {
            imageRef.getMetadata().then((meta) => {
              meta.contentType;

              const imageUrl = downloadURL;
              const imageData: ImageItemIndex = {
                parentId: '',
                caption: imageRef.fullPath,
                type: 'IN_NOT_USED',
                imageSrc: imageUrl,
                fullPath: imageRef.fullPath,
                fileName: imageRef.name,
                size: 'original',
                imageAlt: imageRef.name,
                ranking: ranking,
                contentType: meta.contentType,
                id: '',
              };
              console.debug('Map Size', this.hashImageItemMap.size);

              const file = this.hashImageItemMap.get(imageData.fileName);
              if (file === undefined || file === null) {
                //this.setCollectionDescription(imageData);
                console.debug(`Added ${imageData.fileName}`);
              }
            });
          });
          console.debug('createRawImagesList_200 completed');
        });
      });
  }
}
