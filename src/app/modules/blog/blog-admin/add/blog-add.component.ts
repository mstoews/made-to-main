import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Blog, BlogPartial } from 'app/models/blog';

import { BlogService } from 'app/services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'blog-add',
  templateUrl: './blog-add.component.html',
  styleUrls: ['./blog-add.component.css'],
})
export class BlogAddDialog {
  title: string;
  blogId: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private blog: Blog,
    private blogService: BlogService,
    private route: Router,
    private dialogRef: MatDialogRef<BlogAddDialog>
  ) {
    this.title = blog.title;
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.blog.title, Validators.required],
      date_created: [new Date(), Validators.required],
      id: [''],
    });
  }

  save() {}

  update(results: any) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const newBlog = { ...this.form.value } as BlogPartial;
    this.blogService.createPartial(newBlog).then((blog) => {
      this.blogId = blog.id;
      newBlog.id = this.blogId;
      newBlog.published = false;
      newBlog.date_created = updateDate;
      this.blogService.updatePartial(newBlog);
      this.route.navigate(['blog-admin/blog-admin', this.blogId]);
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}

export function openBlogAddDialog(dialog: MatDialog, blog: Blog) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'modal-panel';
  config.backdropClass = 'backdrop-modal-panel';
  config.width = '400px';

  config.data = {
    ...blog,
  };

  const dialogRef = dialog.open(BlogAddDialog, config);

  return dialogRef.afterClosed();
}
