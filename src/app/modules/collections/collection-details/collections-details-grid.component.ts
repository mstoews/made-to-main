import { Component, Input, OnInit } from '@angular/core';
import { filter, Observable, Subscription } from 'rxjs';
import { Collection } from 'app/models/collection';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'app/models/item';
import { IImageStorage } from 'app/models/maintenance';

import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';
import { openCollectionsAddDialog } from '../collections-details-add/collections-details-add.component';
import { CollectionsService } from 'app/services/collections.service';

@Component({
  selector: 'collections-details-grid',
  templateUrl: './collections-details-grid.component.html',
  styleUrls: ['./collections-details-grid.component.css'],
})
export class CollectionsDetailsGridComponent implements OnInit {
  collectionGroup: FormGroup;
  sTitle: string;
  cRAG: string;
  currentDate: Date;

  collapsed = false;
  current_Url: string;
  collectionId: string;
  data: Item[] = [];
  @Input() body: string;

  // Lightbox setup
  private _subscription: Subscription;

  // collection dictionary
  allCollections$: Observable<Collection[]>;
  collectionImages$: Observable<IImageStorage[]>;
  columnsToDisplay: string[] = [
    //'selection',
    'title',
    // 'paragraph',
    // 'body',
    //'conclusion',
  ];

  collection: Collection;

  selectedItemKeys: any;

  selection = new SelectionModel<Collection>();

  onCollectionsToggle(collection: Collection) {
    this.selection.toggle(collection);
    // console.debug(this.selection.selected);
  }

  constructor(
    private collectionService: CollectionsService,
    private fb: FormBuilder,
    private route: Router,
    private dialog: MatDialog,
    private responsive: BreakpointObserver
  ) {}

  onOpenRow(row: any) {
    this.route.navigate(['collections-admin/item', row.id]);
  }

  onAdd() {
    openCollectionsAddDialog(this.dialog, this.collection)
      .pipe(filter((val) => !!val))
      .subscribe((val) => console.debug('new course value:', val));
  }

  ngOnInit() {
    this.Refresh();
    this.cRAG = '#238823';
  }

  contentReady = (e: any) => {
    if (!this.collapsed) {
      this.collapsed = true;
      e.component.expandRow(['Id']);
    }
  };

  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }

  onCellDoublClicked(e: any) {
    this.data = [];
    var counter = 0;
    this.body = e.body;
    const parentId = e.id;

    this.collectionImages$ =
      this.collectionService.getCollectionsImage(parentId);
    this.collectionGroup.setValue(e);
  }

  onNotify(event: any) {
    this.collectionGroup.setValue(event.data);
  }

  Refresh() {
    this.sTitle = 'Collections Lists';
    this.allCollections$ = this.collectionService.getAll();
  }

  onCreate(data: any) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const newCollections = { ...this.collectionGroup.value } as Collection;
    newCollections.date_updated = updateDate;
    newCollections.date_created = updateDate;
    this.collectionService.createCollection(newCollections);
  }

  onDelete(data: Collection) {
    if (confirm('Are you sure you want to delete ?') === true) {
      data = this.collectionGroup.getRawValue();
      // console.debug(`onDelete: ${data}`);
      this.collectionService.delete(data.id.toString());
    }
  }

  public collectionType = {
    id: '',
    title: '',
    paragraph: '',
    body: '',
    conclusion: '',
    user_updated: '',
    date_created: '',
    date_updated: '',
  };

  valueChangedEvent(e: any) {
    // console.debug(`collection grid value changed ${e}`)
  }

  createForm(collection: Collection) {
    this.sTitle = 'Collections - ' + collection.title;
    this.collectionGroup = this.fb.group({
      id: [collection.id],
      title: [collection.title],
      body: [collection.body],
      user_updated: [collection.user_updated],
      date_created: [collection.date_created],
      date_updated: [collection.date_updated],
    });
  }
}
