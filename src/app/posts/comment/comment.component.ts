import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Comment } from '../../models/Comment.model';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/User.model';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {

  @Input() comment: Comment;
  public comment$: Subscription;
  public author$: Observable<User>;
  public currentUser: User;
  public checkForUpVote;
  public checkForDownVote;
  public checkForVote;
  public errorMsg: string;

  constructor(private auth: AuthService,
              private posts: PostsService) { }

  ngOnInit() {
    this.author$ = this.auth.getUserInfo(+this.comment.authorId);
    this.currentUser = this.auth.getCurrentUser();
    this.comment$ = this.posts.getPosts().pipe(
      (map(posts => posts.find((post) => post.id === this.comment.postId))),
       map(post => post.comments.find((comment) => comment.id === this.comment.id))
    ).subscribe(
      (comment) => {
        this.checkForUpVote = {
          'text-success': comment.usersUpVoted.find(user => user === this.currentUser.id)
        };
        this.checkForDownVote = {
          'text-danger': comment.usersDownVoted.find(user => user === this.currentUser.id)
        };
        this.checkForVote = { ...this.checkForUpVote, ...this.checkForDownVote };
      }
    );
  }

  onVote(vote: number) {
    this.posts.adjustCommentVote(this.comment.postId, this.comment.id, vote, this.currentUser.id)
      .then()
      .catch(error => this.errorMsg = error);
  }

  onDeleteComment() {
    this.posts.deleteComment(this.comment.postId, this.comment.id, this.currentUser.id)
      .then()
      .catch(error => this.errorMsg = error);
  }

  ngOnDestroy() {
    this.comment$.unsubscribe();
  }
}
