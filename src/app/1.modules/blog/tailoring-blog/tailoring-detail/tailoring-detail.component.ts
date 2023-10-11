import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Blog } from 'app/5.models/blog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ImageItemIndex } from 'app/5.models/imageItem';

import { AuthService } from 'app/4.services/auth/auth.service';
import { ScrollService } from 'app/4.services/scroll.service';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';


@Component({
  selector: 'app-tailoring-detail',
  templateUrl: './tailoring-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class TailoringDetailComponent implements OnInit, OnDestroy {

  blogId: string;
  blogItem: Observable<Blog>;
  allBlogs$: Observable<Blog[]>;
  blogImages$: Observable<ImageItemIndex[]>;
  public blog!: Blog;
  public userName: string;
  public blog_id: string;
  public bottom = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private scrollTo: ScrollService,
    private route: Router,
    private imageItemIndexService: ImageItemIndexService
  ) {}

  ngOnInit(): void {
    let id: string;


    this.blog = this.activateRoute.snapshot.data['blog'];

    if (this.blog.id) {
      this.blog_id = this.blog.id;
      // console.debug('Blog ID: ' , this.blog_id);
      this.blogImages$ = this.imageItemIndexService.getImagesByTypeId(this.blog.id);
    }
  }

  ngOnDestroy() {}

  onAdd() {
    this.scrollTo.scrollToElementById('comment');
    this.bottom = true;
  }
  gotoTop() {
    this.scrollTo.scrollToElementById('top');
    this.bottom = false;
  }

  backToHome() {
    this.route.navigate(['blog']);
  }

}
