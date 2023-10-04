import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { imageItem, ImageItemIndex } from 'app/5.models/imageItem';
import { ImageListService } from 'app/4.services/image-list.service';
import { Observable, of } from 'rxjs';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowingComponent {
  // featuredList$: Observable<ImageItemIndex[]>;
  imageItemListService = inject(ImageItemIndexService);
  featuredList$ = this.imageItemListService.getAllImages('IN_GALLERY');
}
