import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from 'app/services/blog.service';
import { Blog } from 'app/models/blog';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-lastest-blog',
  templateUrl: './lastest-blog.component.html',
  imports: [CommonModule],
})
export class LastestBlogComponent {
  images: any[] = [];

  constructor(public blogService: BlogService, public router: Router) {
    this.blogService.getAllPublishedBlog().subscribe((blog) => {
      if (blog.length > 0) {
        blog.forEach((element) => {
          this.images.push({ image: element.image });
        });
      }
    });
  }

  onLastestBlog() {
    // console.debug('navigate to blog');
    this.blogService.getAllPublishedBlog().subscribe((blog) => {
      if (blog.length > 0) {
        this.router.navigate(['blog/detail', blog[0].id]);
        return;
      } else {
        this.router.navigate(['blog']);
      }
    });
  }
}
