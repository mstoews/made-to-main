import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { imageItem, imageItemPartial } from 'app/5.models/imageItem';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageListService } from 'app/4.services/image-list.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from 'app/material.module';

@Component({
  selector: 'view-image-item',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MaterialModule ],
  templateUrl: './view-image-item.component.html',
  styleUrls: ['./view-image-item.component.css']
})
export class ViewImageItemComponent {
    title: string;
    itemId: string;
    imageSrc: string;
    removed: boolean = false;
    form: FormGroup;

    constructor(
      private fb: FormBuilder,
      private imageListService: ImageListService,
      @Inject(MAT_DIALOG_DATA) private item: imageItem,
      private dialogRef: MatDialogRef<ViewImageItemComponent>
    ) {
      this.title = item.caption;
      this.imageSrc = item.imageSrc;
      console.log('ViewImageItemComponent', item);
    }

    ngOnInit() {
      this.form = this.fb.group({
        description: [this.item.description],
        caption: [this.item.caption, Validators.required],
        imageSrc: [this.item.imageSrc, Validators.required],
        removed: [this.removed, Validators.required],
      });
    }


    update(results: any) {
      if (results.removed === false) {
        this.item.type = this.item.id;
      }
        else {
          this.item.type = "IN_DELETED";
      }
      this.item.description = results.description;
      this.imageListService.update(this.item, this.item.id);
      this.close();
    }

    close() {
      this.dialogRef.close();
    }
  }


export function openViewComponentDialog(
  dialog: MatDialog,
  item: imageItemPartial,
  productId: string
) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'modal-panel';
  config.backdropClass = 'backdrop-modal-panel';
  config.width = '400px';

  config.data = {
    ...item,
    productId: productId,
  };

  const dialogRef = dialog.open(ViewImageItemComponent, config );

  return dialogRef.afterClosed();
}

