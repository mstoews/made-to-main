import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from 'app/services/blog.service';
import { ImageItemIndexService } from 'app/services/image-item-index.service';

@Component({
  selector: 'app-calendar-blog',
  templateUrl: './calendar-blog.component.html',
  styleUrls: ['./calendar-blog.component.css'],
})
export class CalendarBlogComponent {
  route = inject(Router);
  blogService = inject(BlogService);
  imageItemIndexService = inject(ImageItemIndexService);

  valueChangedEvent($event: Event) {}

  backToHome() {
    this.route.navigate(['home']);
  }

  allBlogs$ = this.blogService.getCalendarBlog();
}
