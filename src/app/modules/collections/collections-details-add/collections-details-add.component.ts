import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Collection } from 'app/models/collection';
import { CollectionsService } from 'app/services/collections.service';
import { Router } from '@angular/router';

@Component({
  selector: 'collections-details-add',
  templateUrl: './collections-details-add.component.html',
  styleUrls: ['./collections-details-add.component.css'],
})
export class CollectionsDetailsAddDialog {
  title: string;
  collectionId: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private collection: Collection,
    private collectionService: CollectionsService,
    private route: Router,
    private dialogRef: MatDialogRef<CollectionsDetailsAddDialog>
  ) {
    this.title = collection.title;
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.collection.title, Validators.required],
      date_created: [new Date(), Validators.required],
      id: [''],
    });
  }

  save() {}

  update(results: any) {
    const newCollection = { ...this.form.value } as Collection;
    this.collectionService.createPartial(newCollection).then((collection) => {
      this.collectionId = collection.id;
      newCollection.id = this.collectionId;
      newCollection.published = false;
      this.collectionService.updatePartial(newCollection);
      this.route.navigate([
        'collection-admin/collection-admin',
        this.collectionId,
      ]);
    });

    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}

export function openCollectionsAddDialog(
  dialog: MatDialog,
  collection: Collection
) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'modal-panel';
  config.backdropClass = 'backdrop-modal-panel';
  config.width = '400px';

  config.data = {
    ...collection,
  };

  const dialogRef = dialog.open(CollectionsDetailsAddDialog, config);
  return dialogRef.afterClosed();
}
