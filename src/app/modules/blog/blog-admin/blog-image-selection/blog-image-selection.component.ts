import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';

import { ImageItemIndexService } from 'app/services/image-item-index.service';
import { imageItem, ImageItemIndex } from 'app/models/imageItem';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'blog-image-selection',
  templateUrl: './blog-image-selection.component.html',
  styleUrls: ['./blog-image-selection.component.css'],
})
export class BlogImageSelectionComponent implements OnInit, OnDestroy {
  @Input() blogId: string;
  @Input() selection: string;

  IN_NOT_USED = 'IN_NOT_USED';

  subNotUsed: Subscription;
  subThoughts: Subscription;

  not_usedImages: ImageItemIndex[] = [];
  blogImages: ImageItemIndex[] = [];

  constructor(
    public imageItemIndexService: ImageItemIndexService,
    private fb: FormBuilder
  ) {}

  async sortNotUsed() {
    return (await this.imageItemIndexService.getAllImages('IN_NOT_USED')).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.ranking < b.ranking ? -1 : 1;
        });
        return data;
      })
    );
  }

  updateImageSelection(image: ImageItemIndex) {
    console.log('updateImageSelection', image.fileName);
  }

  onAddImage(e: ImageItemIndex) {
    e.ranking = 0;
    e.type = this.blogId;
    console.debug('Update Image Type', JSON.stringify(e));
    this.imageItemIndexService.updateImageList(e);
    this.imageItemIndexService.reNumber(this.IN_NOT_USED);
    this.Refresh();
  }

  async sortThoughtImages() {
    return (await this.imageItemIndexService.getImageByType(this.blogId)).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.ranking < b.ranking ? -1 : 1;
        });
        return data;
      })
    );
  }

  async Refresh() {
    this.subNotUsed = (await this.sortNotUsed()).subscribe((item) => {
      this.not_usedImages = item;
    });

    this.subThoughts = (await this.sortThoughtImages()).subscribe((item) => {
      this.blogImages = item;
    });
  }

  ngOnInit() {
    this.Refresh();
  }

  onDelete(arg0: any) {
    throw new Error('Method not implemented.');
  }
  onCreate(arg0: any) {
    throw new Error('Method not implemented.');
  }

  drop(event: CdkDragDrop<imageItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateRanking(event.previousContainer.data);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateImageType(
        event.previousContainer.data,
        event.container.data,
        event.container.id,
        event.currentIndex
      );
    }
  }

  private updateRanking(previousData: any) {
    // loop through just the previous day
    // previous status is the same so not updated
    const cnt = previousData.length;
    if (cnt > 0) {
      let i = 1;
      previousData.forEach((image) => {
        image.ranking = i * 2;
        this.imageItemIndexService.updateImageList(image);
        i++;
      });
      console.debug('updateRanking', previousData);
    }
  }

  private updateRanking1(
    previousData: any,
    imageItem: any,
    currentIndex: number,
    newContainerId: string
  ) {
    if (newContainerId === this.blogId) {
      // const image = imageItem[currentIndex];
      const cnt = previousData.length * 2;
      if (cnt > 0) {
        let i = 1;
        previousData.forEach((image) => {
          image.ranking = i;
          this.imageItemIndexService.updateImageList(image);
          i++;
        });
        console.log('updateRanking', previousData);
      }
    }
  }

  private updateImageType(
    previousData: any,
    newData: any,
    newContainerId: string,
    currentIndex: number
  ) {
    const image = newData[currentIndex];
    image.ranking = 0;
    image.type = newContainerId;
    console.debug('Update Image Type', image);
    this.imageItemIndexService.updateImageList(image);
  }

  ngOnDestroy() {
    this.subNotUsed.unsubscribe();
    this.subThoughts.unsubscribe();
  }
}
