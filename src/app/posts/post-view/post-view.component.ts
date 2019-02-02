import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../models/Post.model';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/User.model';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Comment } from '../../models/Comment.model';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit, OnDestroy {

  public post$: Subscription;
  public post: Post;
  public author$: Observable<User>;
  public currentUser: User;
  public checkForVote;
  public checkForUpVote;
  public checkForDownVote;
  public errorMsg: string;

  constructor(private auth: AuthService,
              private posts: PostsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.post = new Post(0, '', '');
    this.currentUser = this.auth.getCurrentUser();
    this.post$ = this.posts.getPosts().pipe(
      map(posts => posts.find(post => post.id === +this.route.snapshot.params['id'])))
      .subscribe(
      (post) => {
        this.post = post;
        this.post.comments = this.post.comments.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
        this.author$ = this.auth.getUserInfo(post.authorId);
        this.checkForUpVote = {
          'text-success': post.usersUpVoted.find(user => user === this.currentUser.id)
        };
        this.checkForDownVote = {
          'text-danger': post.usersDownVoted.find(user => user === this.currentUser.id)
        };
        this.checkForVote = { ...this.checkForUpVote, ...this.checkForDownVote };
      });
  }

  onVote(vote: number) {
    if ((this.post.usersUpVoted.find(user => user === this.currentUser.id) && vote > 0) ||
      this.post.usersDownVoted.find(user => user === this.currentUser.id) && vote < 0) {
      return;
    }
    this.posts.adjustVote(this.post.id, vote, this.currentUser.id)
      .then(() => {
        this.posts.emitPosts();
      })
      .catch((error) => this.errorMsg = error);
  }

  onCommentAdded(text: string) {
    const newComment = new Comment(this.currentUser.id, this.post.id, text);
    this.posts.addCommentToPost(this.post.id, newComment)
      .then()
      .catch(error => this.errorMsg = error);
  }

  ngOnDestroy() {
    this.post$.unsubscribe();
  }
}
