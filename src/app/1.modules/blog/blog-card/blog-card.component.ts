import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Blog } from 'app/5.models/blog';
import { Observable } from 'rxjs';
import { ImageItemIndex } from '../../../5.models/imageItem';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';

@Component({
  selector: 'blog-card-old',
  templateUrl: './blog-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCardComponent implements OnInit {
  @Input() blog: Blog;
  blogImages$: Observable<(ImageItemIndex & { id: string;})[]>;
  route = inject(Router);
  imageItemIndexService = inject(ImageItemIndexService);

  async ngOnInit() {
    this.blogImages$ = this.imageItemIndexService.getAllImages(this.blog.id);
  }

  onOpenBlog(id: string) {
    this.route.navigate(['blog/detail', id]);
  }
}
