import {
  Component,
  Inject,
  Input,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { filter, Observable, Subscription } from 'rxjs';
import { BlogService } from 'app/4.services/blog.service';
import { Blog } from 'app/5.models/blog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DndComponent } from 'app/3.components/loaddnd/dnd.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Item } from 'app/5.models/item';
import { IImageStorage } from 'app/5.models/maintenance';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { openAddComponentDialog } from '../../shop/shop-inventory-maintenance/add/add.component';
import { openBlogAddDialog } from './add/blog-add.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'blog-list',
  templateUrl: './blog-grid.component.html',
  styleUrls: ['./blog-grid.component.css'],
})
export class BlogAdminComponent implements OnInit {
  blogGroup: FormGroup;
  sTitle: string;
  cRAG: string;
  currentDate: Date;

  collapsed = false;
  current_Url: string;
  blogId: string;
  data: Item[] = [];
  @Input() para: string;
  @Input() body: string;
  @Input() conclusion: string;

  // Lightbox setup
  private _subscription: Subscription;

  // blog dictionary
  allBlogs$: Observable<Blog[]>;
  blogImages$: Observable<IImageStorage[]>;
  columnsToDisplay: string[] = [
    //'selection',
    'title',
    'paragraph',
    // 'body',
    //'conclusion',
  ];

  blog: Blog;

  selectedItemKeys: any;

  selection = new SelectionModel<Blog>();

  onBlogToggle(blog: Blog) {
    this.selection.toggle(blog);
    // console.debug(this.selection.selected);
  }

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder,
    private route: Router,
    private dialog: MatDialog,
    private responsive: BreakpointObserver
  ) {}

  onOpenRow(row: any) {
    this.route.navigate(['blog-admin/blog-admin', row.id]);
  }

  onAdd() {
    openBlogAddDialog(this.dialog, this.blog)
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
    // this.data = [];
    // var counter = 0;
    // this.para = e.paragraph;
    // this.conclusion = e.conclusion;
    // this.body = e.body;
    // const parentId = e.key;

    // this.blogImages$ = this.blogService.getBlogImage(parentId);
    // this.blogGroup.setValue(e);
    this.route.navigate(['blog-admin/blog-admin', e.key]);
  }

  onNotify(event: any) {
    this.blogGroup.setValue(event.data);
  }

  Refresh() {
    this.sTitle = 'Blog Lists';
    this.allBlogs$ = this.blogService.getAll();
  }

  onCreate(data: any) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const newBlog = { ...this.blogGroup.value } as Blog;
    newBlog.date_updated = updateDate;
    newBlog.date_created = updateDate;
    this.blogService.createBlog(newBlog);
  }

  onDelete(data: Blog) {
    data = this.blogGroup.getRawValue();
    // console.debug(`onDelete: ${data}`);
    this.blogService.delete(data.id.toString());
  }

  valueChangedEvent(e: any) {
     console.debug(`blog grid value changed ${e}`)
  }

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
    });
  }
}
