import {
  Component,
  Inject,
  Input,
  OnInit,
  Optional,
  inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Blog } from 'app/models/blog';
import { BlogService } from 'app/services/blog.service';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DndComponent } from 'app/components/loaddnd/dnd.component';
import {
  FilterEnum,
  ImageToolbarService,
} from 'app/services/image-toolbar.service';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css'],
})
export class BlogEditComponent implements OnInit {
  cRAG: any;
  sTitle: any;
  blogGroup: any;
  //blogImages$: any;
  inventory_images: 'all' | 'not_used' = 'not_used';

  sub: any;
  blogId: string;
  para: string;
  body: string;
  conclusion: string;

  blogItem: Observable<Blog>;
  allBlogs$: Observable<Blog[]>;

  blog!: Blog;

  constructor(
    private matDialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private blogService: BlogService,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public parentId: string
  ) {}

  imageToolbarService = inject(ImageToolbarService);

  ngOnInit(): void {
    var id: string;
    this.blog = this.activateRoute.snapshot.data['blog'];
    //this.blogImages$ = this.blogService.getBlogImage(this.blog.id);

    // console.debug("Blog data", this.blog);

    if (this.blog) {
      this.blogId = this.blog.id;
      this.para = this.blog.paragraph;
      this.body = this.blog.body;
      this.conclusion = this.blog.conclusion;
      this.createForm(this.blog);
    }
  }

  onAllImages() {
    this.imageToolbarService.changeFilter(FilterEnum.all);
  }

  onNotUsedImages() {
    this.imageToolbarService.changeFilter(FilterEnum.not_used);
  }

  onUpdate(blog: Blog) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    blog = { ...this.blogGroup.value } as Blog;
    console.debug('Set to be published? ...: ', blog.published);
    console.debug('Is it a tailored blog post? ...: ', blog.tailoring);
    if (this.para === undefined) {
      this.para = '';
    }
    blog.paragraph = this.para;
    if (this.body === undefined) {
      this.body = '';
    }
    blog.body = this.body;
    if (this.conclusion === undefined) {
      this.conclusion = '';
    }
    blog.conclusion = this.conclusion;
    blog.date_updated = updateDate;
    this.blogService.update(blog);
  }

  onCreate(data: any) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const newBlog = { ...this.blogGroup.value } as Blog;
    newBlog.date_updated = updateDate;
    newBlog.date_created = updateDate;
    this.blogService.createBlog(newBlog);
  }

  dateFormatter(params: any) {
    const dateAsString = params.value;
    const dateParts = dateAsString.split('-');
    return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2].slice(0, 2)}`;
  }

  onBackToBlog() {
    this._location.back();
  }

  onPublish(blog: Blog) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    blog.published = true;
    this.blogService.update(blog);
  }

  onDelete(data: Blog) {
    if (confirm('Are you sure to delete ' + data.title + '?')) {
      this.blogService.delete(data.id.toString());
      this.createEmptyForm();
      return true;
    }
    return false;
  }

  closeDialog() {}

  createForm(blog: Blog) {
    this.sTitle = 'Blog - ' + blog.title;
    this.blogGroup = this.fb.group({
      id: [blog.id],
      title: [blog.title],
      paragraph: [blog.paragraph],
      body: [blog.body],
      conclusion: [blog.conclusion],
      user_updated: [blog.user_updated],
      date_created: [blog.date_created],
      date_updated: [blog.date_updated],
      published: [blog.published],
      tailoring: [blog.tailoring],
      calendar: [blog.calendar],
    });
  }

  onImages() {
    const parentId = this.blogGroup.getRawValue();
    const dialogRef = this.matDialog.open(DndComponent, {
      width: '500px',
      data: {
        parent: parentId.id,
        location: 'blog',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === undefined) {
        result = { event: 'Cancel' };
      }
      switch (result.event) {
        case 'Create':
          this.create(result.data);
          break;
        case 'Cancel':
          break;
      }
    });
  }

  create(data: any) {
    const rawData = this.blogGroup.getRawValue();
    this.blogService.update(rawData);
    /// this.afs.collection('blog').doc(rawData.id).collection('images').add(data);
    /* MARK */
  }

  createEmptyForm() {
    this.blogGroup = this.fb.group({
      id: [''],
      title: [''],
      paragraph: [''],
      body: [''],
      conclusion: [''],
      user_updated: [''],
      date_created: [''],
      date_updated: [''],
    });
  }
}
