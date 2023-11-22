import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserService } from 'app/services/auth/user.service';
import { BlogService } from 'app/services/blog.service';
import { Observable } from 'rxjs';
import { Comments } from '../../../models/blog';
import { ReplyDialogComponent } from '../reply-dialog/reply-dialog.component';

@Component({
  selector: 'blog-comments-list',
  templateUrl: './comments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsListComponent implements OnInit {
  userService = inject(UserService);
  blogService = inject(BlogService);
  dialog = inject(MatDialog);

  isAdmin = false;

  @Input() blog_id: string;

  Comments$: Observable<Comments[]>;

  ngOnInit(): void {
    if (this.blog_id !== undefined) {
      this.Comments$ = this.blogService.getComments(this.blog_id);
    }
  }

  valueChangedEvent($event: any) {}

  dateFormatter(params: any) {
    const dateAsString = params.value;
    const dateParts = dateAsString.split('-');
    return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2].slice(0, 2)}`;
  }

  deleteComment(blog_id: string, comment_id: string) {
    this.blogService.deleteComment(blog_id, comment_id);
  }

  createReply(blog_id: string, comment_id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false; // closes when you tap outside the dialog box
    dialogConfig.autoFocus = true; //
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(ReplyDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result.reply) {
        this.blogService.addCommentReply(
          blog_id,
          comment_id,
          result.reply.reply
        );
      }
    });
  }
}
