import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initTE, Lightbox } from 'tw-elements';
import { ImageItemIndex } from 'app/models/imageItem';

@Component({
  selector: 'app-tw-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tw-lighthouse.component.html',
  styleUrls: ['./tw-lighthouse.component.css'],
})
export class TwLighthouseComponent implements OnInit {
  @Input() public imageCollection: ImageItemIndex[] = [];
  imageCount = signal<number>(0);
  imageItems = <ImageItemIndex[]>[];

  imageURL: string;

  ngOnInit() {
    initTE({ Lightbox });
    this.imageCount.set(this.imageCollection.length);
    console.log(this.imageCount());
    if (this.imageCollection.length > 6) {
      this.imageItems = this.imageCollection.slice(0, 6);
    } else {
      this.imageItems = this.imageCollection;
    }
    this.imageURL = this.imageItems[0].imageSrc800;
  }
}
