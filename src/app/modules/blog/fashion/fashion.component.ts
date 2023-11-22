import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Blog } from 'app/models/blog';
import { Router } from '@angular/router';
import { BlogService } from 'app/services/blog.service';
import { ImageItemIndexService } from 'app/services/image-item-index.service';
import { ImageItemIndex } from 'app/models/imageItem';
import { Observable } from 'rxjs';

@Component({
  selector: 'blog-card',
  templateUrl: './fashion.component.html',
  styleUrls: ['./fashion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FashionComponent implements OnInit {
  @Input() blog: Blog;
  blogImages$: Observable<(ImageItemIndex & { id: string })[]>;
  imageList = inject(ImageItemIndexService);
  router = inject(Router);

  ngOnInit(): void {
    this.blogImages$ = this.imageList.getAllImages(this.blog.id);
  }

  onOpenBlog(id: string) {
    this.router.navigate(['blog/detail', id]);
    // this.toggleDrawer();
  }

  onAdd() {
    // console.debug('onAdd --- add a new comment');
  }

  valueChangedEvent($event: Event) {
    throw new Error('Method not implemented.');
  }
}
