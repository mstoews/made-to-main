import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  OnDestroy,
} from '@angular/core';

import { Observable, Subject, Subscription, map, takeUntil } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Category } from 'app/models/category';
import { CategoryService } from 'app/services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageItemIndex } from 'app/models/imageItem';
import { ImageItemIndexService } from 'app/services/image-item-index.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'category-list',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryGridComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatDrawer;
  drawOpen: 'open' | 'close' = 'open';
  categoryGroup: FormGroup;
  currentDoc: string;
  sTitle: string;
  category: any;
  collapsed = false;
  selectedItemKeys: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  auth: Auth = inject(Auth);
  snackBar = inject(MatSnackBar);
  imageItemIndexService = inject(ImageItemIndexService);
  categoryService = inject(CategoryService);
  fb = inject(FormBuilder);

  subNotUsed: Subscription;

  not_usedImages: ImageItemIndex[] = [];

  allCategories$ = this.categoryService.getAll();

  async onRefresh() {
    this.allCategories$ = this.categoryService.getAll();
    (await this.sortNotUsed())
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((item) => {
        this.not_usedImages = item;
      });
  }

  async sortNotUsed() {
    return (await this.imageItemIndexService.getAllImages('IN_NOT_USED')).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.caption < b.caption ? -1 : 1;
        });
        return data;
      })
    );
  }

  async ngOnInit() {
    this.sTitle = 'Category Lists';
    this.createEmptyForm();
    (await this.sortNotUsed()).subscribe((item) => {
      this.not_usedImages = item;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  contentReady = (e: any) => {
    if (!this.collapsed) {
      this.collapsed = true;
      e.component.expandRow(['Id']);
    }
  };

  createEmptyForm() {
    this.categoryGroup = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      jp_description: ['', Validators.required],
      createDate: [new Date().toISOString().split('T')[0], Validators.required],
      updateDate: [new Date().toISOString().split('T')[0], Validators.required],
      updateBy: ['Admin'],
      image: ['', Validators.required],
    });
  }

  UpdateCategoryURL(e: ImageItemIndex) {
    this.categoryGroup.patchValue({
      image: e.imageSrc200,
    });
  }

  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }

  onCellDoublClicked(e: any) {
    this.currentDoc = e.data.id;

    const dDate = new Date(e.data.updateDate);
    const updateDate = dDate.toISOString().split('T')[0];

    if (e.data.jp_description === undefined) {
      e.data.jp_description = '';
    }

    const data = {
      name: e.data.name,
      description: e.data.description,
      jp_description: e.data.jp_description,
      image: e.data.image,
      createDate: e.data.createDate,
      updateDate: updateDate,
      updateBy: e.data.updateBy,
    };
    this.categoryGroup.setValue(data);
    this.openDrawer();
  }

  onNotify(event: any) {
    this.categoryGroup.setValue(event.data);
    this.toggleDrawer();
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

  onCreate() {
    this.currentDoc = '';
    this.createEmptyForm();
    this.openDrawer();
  }

  onUpdate(category: Category) {
    if (this.currentDoc !== '') {
      category.id = this.currentDoc;
      this.categoryService.update(category);
    } else {
      const data = {
        name: category.name,
        description: category.description,
        jp_description: category.jp_description,
        image: category.image,
        createDate: category.createDate,
        updateDate: category.updateDate,
        updateBy: category.updateBy,
      };
      this.categoryService.add(data);
    }

    this.snackBar.open('Category Updated', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'bg-success',
      duration: 2000,
    });

    this.createEmptyForm();
  }

  onDelete(data: Category) {
    if (confirm('Are you sure to delete ' + data.description + '?')) {
      data.id = this.currentDoc;
      if (data.id === '') {
        return;
      }
      this.categoryService.delete(data.id);
      this.snackBar.open('Category Deleted', 'OK', { duration: 2000 });
      this.createEmptyForm();
    }
  }
}
