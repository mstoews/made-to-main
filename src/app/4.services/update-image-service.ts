import { Injectable, OnDestroy, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { map, Subject, takeUntil } from 'rxjs';

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
        var fileExt = value.fileName.split('.').pop();
        let fileName = value.fileName.replace(/\.[^/.]+$/, '');
        fileName = fileName
          .replace(`/${size}`, '')
          .replace(`_${size}x${size}`, '');

        switch (size) {
          case '200':
            fileName = `/200/${fileName}_${size}x${size}.${fileExt}`;
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
            fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
            this.storage
              .ref(fileName)
              .getDownloadURL()
              .subscribe((mediumSrc) => {
                value.imageSrc400 = mediumSrc;
                this.imageIndexCollections.doc(value.id).update(value);
                //this.imageItemCopyCol.doc(imgItem.id).update(imgItem);
              });
            break;

          case '800':
            fileName = `/${size}/${fileName}_${size}x${size}.${fileExt}`;
            this.storage
              .ref(fileName)
              .getDownloadURL()
              .subscribe((smallSrc) => {
                console.debug(smallSrc);
                value.imageSrc800 = smallSrc;
                this.imageIndexCollections.doc(value.id).update(value);
              });
            break;
          default:
            let fileNameDefault = `/${value.fileName}`;
            this.storage
              .ref(fileNameDefault)
              .getDownloadURL()
              .subscribe((data) => {
                console.debug(data);
              });
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

  addOriginalImageList(imageData: ImageItemIndex) {
    this.imageIndexCollections.add(imageData).then((img) => {
      imageData.id = img.id;
      this.imageIndexCollections.doc(imageData.id).update(imageData);
    });
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
