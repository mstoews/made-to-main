import {
  Component,
  ViewChild,
  ElementRef,
  Inject,
  Optional,
  inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, map, shareReplay, take, takeUntil } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { ProgressComponent } from '../progress/progress.component';
import { DndDirective } from './dnd.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { DeleteDuplicateService } from 'app/4.services/delete-duplicate.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ProgressComponent,
    DndDirective,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  selector: 'image-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.scss'],
})
export class DndComponent implements OnDestroy {
  subAllImages: any;
  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DndComponent>,
    public storage: AngularFireStorage,

    @Optional() @Inject(MAT_DIALOG_DATA) public imageData: any
  ) {
    this.createForm();
  }


  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild('fileDropRef', { static: false })
  downloadUrl: Observable<string | null>;

  files: any[] = [];
  upLoadFiles: File[] = [];
  formGroup!: UntypedFormGroup;
  fileData: any;
  VERSION_NO = 1;
  percentageChange$: Observable<number | undefined>;
  public ImageItemIndex!: ImageItemIndex;
  allImages: ImageItemIndex[] = [];
  hashOriginalIndexMap = new Map<string, ImageItemIndex>();
  deleteDuplicateService = inject(DeleteDuplicateService);


  async sortAllImages() {
    return (await this.deleteDuplicateService.getAllImages('')).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.ranking < b.ranking ? -1 : 1;
        });
        return data;
      })
    );
  }

  async onCheckList() {
    let spinner = true;
    this.subAllImages = (await this.sortAllImages()).subscribe((item) => {
      this.allImages = item;
      if (this.allImages.length > 0) {
        this.deleteDuplicateService.onUpdateImageList(this.allImages);
      }
      spinner = false;
    });
  }

  createForm() {
    this.formGroup = this.fb.group({});
  }

  onFileDropped($event: any) {
    // console.debug($event);
    this.prepareFilesList($event);
  }

  fileBrowseHandler($event: any) {
    this.prepareFilesList($event.target.files);
  }

  prepareFilesList(files: any) {
    for (const item of files) {
      // console.debug(`file list: ${item.name}`);
      this.upLoadFiles.push(item);
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      // console.debug('delete files ');
      return;
    }
    this.files.splice(index, 1);
  }

  uploadFileProgress(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFileProgress(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 4);
      }
    }, 10);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 4);
      }
    }, 10);
  }

  async startUpload(file: File, imageDt: any) {
    const location = '/';
    const path = `${location}/${file.name}`;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, file, {
      cacheControl: 'max-age=2592000, public',
    });
    let complete = true;

    this.percentageChange$ = task.percentageChanges();
    this.percentageChange$.pipe(takeUntil(this._unsubscribeAll), shareReplay()).subscribe(async (data) => {

      if (data === 100 && complete === true ) {
        complete = false; // make sure this is only called once
        console.debug(`complete: ${complete}`);
        await this.deleteDuplicateService.getImageURL(fileRef, imageDt, file, path);
      }
    });
  }

  async onCreate() {
    let data = this.imageData;
    for (const item of this.upLoadFiles) {
      await this.startUpload(item, data);
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  ngOnDestroy(): void {
    if (this.subAllImages != null) {
      this.subAllImages.unsubscribe();
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
