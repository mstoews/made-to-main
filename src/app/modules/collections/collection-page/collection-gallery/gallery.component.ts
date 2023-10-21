import { Component, Input, OnInit, signal } from '@angular/core';
import { initTE, Lightbox } from 'tw-elements';
import { ImageItemIndex } from 'app/models/imageItem';

@Component({
  selector: 'collection-gallery',
  templateUrl: './gallery.component.html',
})
export class CollectionGalleryComponent implements OnInit {
  @Input() public imageCollection: ImageItemIndex[] = [];

  imageCount = signal<number>(0);
  imageItems = <ImageItemIndex[]>[];
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
  image7: string;
  image8: string;
  image9: string;

  caption1: string;
  caption2: string;
  caption3: string;
  caption4: string;
  caption5: string;
  caption6: string;
  caption7: string;
  caption8: string;
  caption9: string;

  ngOnInit(): void {
    initTE({ Lightbox });
    this.imageCount.set(this.imageCollection.length);
    console.log(this.imageCount());
    if (this.imageCollection.length > 9) {
      this.imageItems = this.imageCollection.slice(0, 9);
    } else {
      this.imageItems = this.imageCollection;
    }
    this.image1 = this.imageItems[0].imageSrc800;
    this.image2 = this.imageItems[1].imageSrc800;
    this.image3 = this.imageItems[2].imageSrc800;
    this.image4 = this.imageItems[3].imageSrc800;
    this.image5 = this.imageItems[4].imageSrc800;
    this.image6 = this.imageItems[5].imageSrc800;
    this.image7 = this.imageItems[6].imageSrc800;
    this.image8 = this.imageItems[7].imageSrc800;
    this.image9 = this.imageItems[8].imageSrc800;

    this.caption1 = this.imageItems[0].description;
    this.caption2 = this.imageItems[1].description;
    this.caption3 = this.imageItems[2].description;
    this.caption4 = this.imageItems[3].description;
    this.caption5 = this.imageItems[4].description;
    this.caption6 = this.imageItems[5].description;
    this.caption7 = this.imageItems[6].description;
    this.caption8 = this.imageItems[7].description;
    this.caption9 = this.imageItems[8].description;
  }

  onPreviewImage(imageNumber: number) {}
}
