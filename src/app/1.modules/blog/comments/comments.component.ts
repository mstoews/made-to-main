import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from 'app/4.services/blog.service';
import { Comments } from '../../../5.models/blog';

@Component({
  selector: 'blog-comments',
  templateUrl: './comments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnInit {
  commentGroup: FormGroup;

  comment: Comments;

  constructor(

    private fb: FormBuilder,

    private blogService: BlogService
  ) {
    this.createForm();
  }

  @Input() userName: string;
  @Input() blog_id: string;

  ngOnInit() {}

  onSubmit() {
    const data = this.commentGroup.getRawValue();
    const dDate = new Date();
    const updateDate = dDate.toISOString();

    if (this.userName === undefined) {
      this.userName = 'Guest';
    }
    const commentEntry = {
      id: '',
      created_date: updateDate,
      message: data.message,
      name: this.userName,
      blog_id: this.blog_id,
      reply: '',
      reply_date: '',
    };
    this.blogService.createComment(commentEntry);
    this.createForm();
  }

  createForm() {
    this.commentGroup = this.fb.group({
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(300),
        ],
      ],
    });
  }
}
