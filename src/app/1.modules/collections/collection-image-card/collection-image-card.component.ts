import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { imageItem } from 'app/5.models/imageItem';


@Component({
  selector: 'collection-image-card',
  templateUrl: './collection-image-card.component.html',
})
export class CollectionImageCardComponent {

  @Input() image: imageItem;
  @Output() collectionImageSelected: EventEmitter<imageItem> =
    new EventEmitter();

  onDblClick(e: any): void {
    console.debug(this.image);
    this.collectionImageSelected.emit(this.image);
  }
}
