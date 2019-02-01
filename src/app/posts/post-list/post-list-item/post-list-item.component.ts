import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Post } from '../../../models/Post.model';
import { User } from '../../../models/User.model';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss']
})
export class PostListItemComponent implements OnInit {

  @Input() post: Post;
  public author$: Observable<User>;
  public currentUser: User;
  public checkForVote;
  public checkForUpVote;
  public checkForDownVote;
  public errorMsg: string;

  constructor(private auth: AuthService,
              private posts: PostsService) { }

  ngOnInit() {
    this.author$ = this.auth.getUserInfo(this.post.authorId);
    this.currentUser = this.auth.getCurrentUser();
    this.refreshVoteClasses();
  }

  refreshVoteClasses() {
    this.checkForUpVote = {
      'text-success': this.post.usersUpVoted.find(user => user === this.currentUser.id)
    };
    this.checkForDownVote = {
      'text-danger': this.post.usersDownVoted.find(user => user === this.currentUser.id)
    };
    this.checkForVote = {...this.checkForUpVote, ...this.checkForDownVote};
  }

  onVote(vote: number) {
    if ((this.post.usersUpVoted.find(user => user === this.currentUser.id) && vote > 0) ||
         this.post.usersDownVoted.find(user => user === this.currentUser.id) && vote < 0) {
      return;
    }
    this.posts.adjustVote(this.post.id, vote, this.currentUser.id)
      .then(() => this.refreshVoteClasses())
      .catch((error) => this.errorMsg = error);
  }
}
