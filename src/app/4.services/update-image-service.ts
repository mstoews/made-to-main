import { Injectable, OnDestroy, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { first, map, Observable, Subject, takeUntil } from 'rxjs';
import { convertSnaps } from './db-utils';

@Injectable({
  providedIn: 'root',
})
export class UpdateImageService implements OnDestroy{


  constructor() {
    this.createOriginalIndexMaps();
  }

  afs = inject(AngularFirestore);
  storage = inject(AngularFireStorage);

  imageIndexCollections = this.afs.collection<ImageItemIndex>('originalImageList');
  imageIndexItems = this.imageIndexCollections.valueChanges({ idField: 'id' });

  hashOriginalIndexMap = new Map<string, ImageItemIndex>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  updateImageList(): void {

    this.updateImageIndexList('200');
    this.updateImageIndexList('400');
    this.updateImageIndexList('800');
  }

  updateImageIndexList(size: string): void {
    console.debug('Number of image items', this.hashOriginalIndexMap.size);

    if( this.hashOriginalIndexMap.size > 0) {

      this.hashOriginalIndexMap.forEach((value, key) => {
        let imageSrc200 = value.imageSrc200;
        let imageSrc400 = value.imageSrc400;
        let imageSrc800 = value.imageSrc800;


        var fileExt = value.fileName.split('.').pop();
        let fileName = value.fileName.replace(/\.[^/.]+$/, '');

        fileName = fileName
          .replace(`/${size}`, '')
          .replace(`_${size}x${size}`, '');

        switch (size) {
          case '200':
            if (imageSrc200 === undefined || imageSrc200 === null) {
              imageSrc200 = '';
            }
            else {
              break;
            }
            fileName = `/thumbnails/${fileName}_${size}x${size}.${fileExt}`;

            this.storage
              .ref(fileName)
              .getDownloadURL()
              .subscribe((smallSrc) => {
                console.debug(smallSrc);
                value.imageSrc200 = smallSrc;
                this.imageIndexCollections.doc(value.id).update(value);
              });
            break;

          case '400':
            if (imageSrc400 === undefined || imageSrc400 === null) {
              imageSrc400 = '';
            }
            else {
              break;
            }
            fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
            this.storage
              .ref(fileName)
              .getDownloadURL()
              .subscribe((mediumSrc) => {
                value.imageSrc400 = mediumSrc;
                this.imageIndexCollections.doc(value.id).update(value);

              });
            break;

          case '800':
            if (imageSrc800 === undefined || imageSrc800 === null) {
              imageSrc800 = '';
            }
            else {
              break;
            }
            fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
            this.storage
              .ref(fileName)
              .getDownloadURL()
              .subscribe((largeSrc) => {
                console.debug(largeSrc);
                value.imageSrc800 = largeSrc;
                this.imageIndexCollections.doc(value.id).update(value);
              });
            break;
          default:
            break;
        }
      });
    }
    else {
      alert('No images to update');
    }
  }

  updateOriginalImageList(): void {
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
                category: 'IN_NOT_USED',
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

              console.debug('Map Size', this.hashOriginalIndexMap.size);

              const file = this.hashOriginalIndexMap.get(imageData.fileName);
              if (file === undefined || file === null) {
                this.addOriginalImageList(imageData);
                this.hashOriginalIndexMap.set(imageData.fileName, imageData);
              }
            });
          });
          console.debug('createRawImagesList_200 completed');
        });
      });
  }

  addOriginalImageList(imageData: ImageItemIndex): boolean {
    let added = false;
    this.findProductByUrl(imageData.fileName).subscribe((image) => {
      if (image === undefined) {
        this.imageIndexCollections.add(imageData).then((img) => {
          imageData.id = img.id;
          this.imageIndexCollections.doc(imageData.id).update(imageData);
        });
        added = true;
      }
    });
    return added;
  }


  findProductByUrl(fileName: string): Observable<ImageItemIndex> {
    return this.afs
      .collection('originalImageList', (ref) => ref.where('fileName', '==', fileName))
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          const product = convertSnaps<ImageItemIndex>(snaps);
          return product.length == 1 ? product[0] : undefined;
        }),
        first()
      );
  }


  test() {
    this.imageIndexItems
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((images) => {
      images.forEach((image) => {
         console.debug(image);
      });
    });
  }

  createOriginalIndexMaps(): void {
    this.hashOriginalIndexMap.clear();
    this.imageIndexItems
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((images) => {
        images.forEach((image) => {
          this.hashOriginalIndexMap.set(image.fileName, image);
        });
        console.debug(this.hashOriginalIndexMap.size);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
