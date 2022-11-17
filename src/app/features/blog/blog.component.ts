import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { BlogService } from 'app/services/blog.service';
import { Blog } from 'app/models/blog'
import { Observable } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
})
export class BlogComponent implements OnInit {
valueChangedEvent($event: Event) {
throw new Error('Method not implemented.');
}

@ViewChild('drawer') drawer: MatDrawer;

drawOpen: 'open' | 'close' = 'open';

openDrawer() {
  const opened = this.drawer.opened;
  if (opened !== true) {
    this.drawer.toggle();
  } else {
    return;
  }
}

closeDrawer() {
  const opened = this.drawer.opened;
  if (opened === true) {
    this.drawer.toggle();
  } else {
    return;
  }
}

toggleDrawer() {
  const opened = this.drawer.opened;
  if (opened !== true) {
    this.drawer.toggle();
  } else {
    if (this.drawOpen === 'close') {
      this.drawer.toggle();
    }
  }
}


  constructor(private blogService: BlogService ) { }

  allBlogs$: Observable<Blog[]>;
  blog: Blog;


  ngOnInit(): void {

    this.allBlogs$ = this.blogService.getAll();

  }

}
