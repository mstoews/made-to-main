import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { BlogService } from 'app/services/blog.service';
import { Blog } from 'app/models/blog';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { fadeInOut } from '../../landing-page/animations';
import { ImageItemIndexService } from 'app/services/image-item-index.service';
import { ImageItemIndex } from 'app/models/imageItem';

@Component({
  selector: 'app-tailoring-blog',
  templateUrl: './tailoring-blog.component.html',
  styleUrls: ['./tailoring-blog.css'],
  animations: [fadeInOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TailoringBlogComponent {
  route = inject(Router);
  blogService = inject(BlogService);
  imageItemIndexService = inject(ImageItemIndexService);

  valueChangedEvent($event: Event) {}

  backToHome() {
    this.route.navigate(['home']);
  }

  allBlogs$ = this.blogService.getTailoringBlog();
}
