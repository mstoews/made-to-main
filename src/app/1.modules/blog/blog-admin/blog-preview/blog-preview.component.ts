import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImageItemIndexService } from 'app/4.services/image-item-index.service';
import { ImageListService } from 'app/4.services/image-list.service';
import { ScrollService } from 'app/4.services/scroll.service';
import { Blog } from 'app/5.models/blog';
import { ImageItemIndex } from 'app/5.models/imageItem';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-blog-preview',
  templateUrl: './blog-preview.component.html',
  styleUrls: ['./blog-preview.component.css'],
})
export class BlogPreviewComponent {
  blogId: string;
  blogItem: Observable<Blog>;

  blogImages$: Observable<ImageItemIndex[]>;

  public bottom = false;

  @Input() blog: Blog;

  constructor(
    private scrollTo: ScrollService,
    private route: Router,
    private imageItemIndexService: ImageItemIndexService
  ) {}

  async sortThoughtImages(blogId: string) {
    return (await this.imageItemIndexService.getImageByType(blogId)).pipe(
      map((data) => {
        data.sort((a, b) => {
          return a.ranking < b.ranking ? -1 : 1;
        });
        return data;
      })
    );
  }

  async ngOnInit(): Promise<void> {
    if (this.blog) {
      this.blogImages$ = await this.sortThoughtImages(this.blog.id);
    } else {
      alert('No Blog images found for this blog. Add at least one');
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
