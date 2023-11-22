import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { DndComponent } from 'app/components/loaddnd/dnd.component';
import { IImageMaintenance } from 'app/models/maintenance';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-images',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css'],
})
export class CollectionsComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  allImageList$: Observable<IImageMaintenance[]>;
  collapsed = false;
  sTitle: string;
  drawOpen: 'open' | 'close' = 'open';
  imageForm: FormGroup;
  image: IImageMaintenance;
  columns = [
    'title',
    'sub_title',
    'image_url',
    'applied',
    'user_updated',
    'date_created',
    'date_updated',
  ];
  selectedItemKeys: any[] = [];
  current_Url: string;
  current_user: string | null | undefined;

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private auth: Auth,
    @Optional() @Inject(MAT_DIALOG_DATA) public parentId: string
  ) {
    this.createEmptyForm();

    this.current_user = auth.currentUser.displayName;
  }

  createEmptyForm() {
    this.imageForm = this.fb.group({
      id: [''],
      title: [''],
      sub_title: [''],
      image_url: [''],
      applied: [''],
      user_updated: [''],
      date_created: [''],
      date_updated: [''],
    });
  }

  ngOnInit(): void {
    this.sTitle = 'Image Maintenance';
  }

  contentReady = (e: any) => {
    if (!this.collapsed) {
      this.collapsed = true;
      e.component.expandRow(['Id']);
    }
  };

  onCellDoublClicked(e: any) {
    this.current_Url = e.data.image_url;
    this.imageForm.setValue(e.data);
    this.openDrawer();
  }

  onCellClicked(e: any) {
    this.imageForm.setValue(e.data);
    this.openDrawer();
  }

  onNotify(event: any) {
    this.imageForm.setValue(event.data);

    this.toggleDrawer();
  }

  onFocusedRowChanged(e: any) {
    const rowData = e.row && e.row.data;

    this.current_Url = rowData.image_url;
    this.imageForm.setValue(rowData);
  }

  createForm(image: IImageMaintenance) {
    this.sTitle = 'Inventory - ' + image.title;
    this.imageForm = this.fb.group({
      id: [image.id],
      title: [image.title],
      sub_title: [image.sub_title],
      image_url: [image.image_url],
      applied: [image.applied],
      user_updated: [image.user_updated],
      date_created: [image.date_created],
      date_updated: [image.date_updated],
    });
  }

  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }

  Add() {
    this.openDrawer();
  }

  Delete() {
    this.openDrawer();
  }

  Clone() {
    this.openDrawer();
  }

  onCreate() {
    const newItem = { ...this.imageForm.value } as IImageMaintenance;
    const currentUser = this.auth.currentUser;
    newItem.user_updated = this.current_user;
    this.imageMaintanenceService.create(newItem);
  }

  onImages() {
    const parentId = this.imageForm.getRawValue();
    const dialogRef = this.matDialog.open(DndComponent, {
      width: '500px',
      data: parentId.id,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === undefined) {
        result = { event: 'Cancel' };
      }
      switch (result.event) {
        case 'Create':
          this.create(result);
          break;
        case 'Cancel':
          break;
      }
    });
  }

  create(data: any) {
    const rawData = this.imageForm.getRawValue();
    rawData.image_url = data.data.url;
  }

  onUpdate(data: IImageMaintenance) {
    data = this.imageForm.getRawValue();
  }

  onDelete(data: IImageMaintenance) {
    data = this.imageForm.getRawValue();
  }

  closeDialog() {
    this.closeDrawer();
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
  customizeTooltip = (pointsInfo: any) => ({
    text: `${parseInt(pointsInfo.originalValue)}%`,
  });
}
