import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  inject,
  ViewChild,
} from '@angular/core';

import { imageItem, ImageItemIndex } from 'app/5.models/imageItem';
import { Collection } from 'app/5.models/collection';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';
import { initTE, Lightbox } from 'tw-elements';

@Component({
  selector: 'app-collection-preview',
  templateUrl: './collection-preview.component.html',
  styleUrls: ['./collection-preview.component.css'],
})
export class CollectionPreviewComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatDrawer;
  drawOpen: 'open' | 'close' = 'open';
  collectionGroup: FormGroup;
  private destroy$ = new Subject<void>();

  @Input() collection: Collection;
  Title = '';
  Description = '';
  imageListService = inject(ImageItemIndexService);
  fb = inject(FormBuilder);

  collectionsImages: ImageItemIndex[] = [];
  subCollections: any;
  item: imageItem = null;
  id: string;

  constructor() {}

  ngOnInit(): void {
    this.Title = this.collection.title;
    this.Description = this.collection.body;
    this.createEmptyForm();
    this.Refresh(this.collection.id);
  }

  onUpdate(imgItem: ImageItemIndex) {
    this.imageListService.updateCollectionDescription(imgItem);
  }

  createEmptyForm() {
    this.collectionGroup = this.fb.group({
      URL: ['', Validators.required],
      Description: ['', Validators.required],
    });
  }

  async Refresh(id: string) {
    this.subCollections = (await this.imageListService.getImageByType(id))
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => {
        this.collectionsImages = item;
      });
  }

  EditTitle(id: string) {
    let item = this.collectionsImages.find((x) => x.id === id);
    if (item !== undefined || item !== null) {
      console.debug('EditTitle', id);
      this.id = id;
      this.createForm(item);
    } else {
      this.createForm(null);
    }
    this.openDrawer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  UpdateDescription(desc: string) {
    let item = this.collectionsImages.find((x) => x.id === this.id);
    if (item !== undefined || item !== null) {
      item.description = desc;
      this.imageListService.updateCollectionDescription(item);
    }
  }

  createForm(item: ImageItemIndex) {
    if (item !== undefined || item !== null) {
      this.collectionGroup = this.fb.group({
        URL: [item.imageSrc200, Validators.required],
        Description: [item.description, Validators.required],
      });
    } else {
      this.collectionGroup = this.fb.group({
        URL: ['', Validators.required],
        Description: ['', Validators.required],
      });
    }
  }

  openDrawer() {
    const opened = this.drawer.opened;
    if (opened !== true) {
      this.drawer.toggle();
    } else {
      return;
    }
  }

  closeDrawer() {
    const opened = this.drawer.opened;
    if (opened === true) {
      this.drawer.toggle();
    } else {
      return;
    }
  }

  toggleDrawer() {
    const opened = this.drawer.opened;
    if (opened !== true) {
      this.drawer.toggle();
    } else {
      if (this.drawOpen === 'close') {
        this.drawer.toggle();
      }
    }
  }
}
