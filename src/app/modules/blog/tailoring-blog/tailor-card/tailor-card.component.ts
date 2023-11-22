import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ImageItemIndexService } from 'app/services/image-item-index.service';
import { Blog } from 'app/models/blog';
import { ImageItemIndex } from 'app/models/imageItem';
import { Observable } from 'rxjs';

@Component({
  selector: 'tailor-card',
  templateUrl: './tailor-card.component.html',
})
export class TailorCardComponent {
  @Input() blog: Blog;
  blogImages$: Observable<(ImageItemIndex & { id: string })[]>;
  imageList = inject(ImageItemIndexService);
  router = inject(Router);

  ngOnInit(): void {
    this.blogImages$ = this.imageList.getAllImages(this.blog.id);
  }

  onOpenBlog(id: string) {
    this.router.navigate(['blog/tailoring', id]);
    // this.toggleDrawer();
  }

  onAdd() {
    // console.debug('onAdd --- add a new comment');
  }

  valueChangedEvent($event: Event) {
    throw new Error('Method not implemented.');
  }
}
