import {CommonModule} from '@angular/common';
import {Component, Input }  from '@angular/core';
import {getDownloadURL, percentage, ref, Storage, uploadBytesResumable} from '@angular/fire/storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {MaterialModule} from '../../material.module';
import {DndDirective} from '../loaddnd/dnd.directive';
import {ProgressComponent} from '../progress/progress.component';

@Component({
  standalone: true,
  imports: [
    CommonModule, MaterialModule, DndDirective, ProgressComponent,
    MatDialogModule, ReactiveFormsModule, FormsModule
  ],
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styleUrls: ['./drag-n-drop.component.scss']
})
export class DragNDropComponent {
  public readonly downloadUrl$!: Observable<string>;
  @Input() file!: File;
  uploadPercent!: Observable<any>;

  constructor(private storage: Storage) {}

  async uploadFile() {
    if (this.file) {
      try {
        const storageRef = ref(this.storage, this.file.name);
        const task = uploadBytesResumable(storageRef, this.file);
        this.uploadPercent = percentage(task);
        await task;
        const url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      // handle invalid file
    }
  }
}



const TRANSPARENT_PNG =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
