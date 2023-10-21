import { Component, Input, OnInit, signal } from '@angular/core';
import { initTE, Lightbox } from 'tw-elements';
import { ImageItemIndex } from 'app/models/imageItem';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
})
export class GalleryComponent implements OnInit {
  @Input() public imageCollection: ImageItemIndex[] = [];

  imageCount = signal<number>(0);
  imageItems = <ImageItemIndex[]>[];

  ngOnInit(): void {
    initTE({ Lightbox });
    this.imageCount.set(this.imageCollection.length);
    console.log(this.imageCount());
    if (this.imageCollection.length > 6) {
      this.imageItems = this.imageCollection.slice(0, 6);
    } else {
      this.imageItems = this.imageCollection;
    }
  }
}
