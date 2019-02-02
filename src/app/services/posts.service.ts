import { Injectable } from '@angular/core';
import { Post } from '../models/Post.model';
import { Comment } from '../models/Comment.model';
import { BehaviorSubject, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [
    {
      title: 'The best place to buy hot sauce',
      id: 1,
      votes: 2,
      comments: [],
      authorId: 1,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ' +
        'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
        'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
        'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
      created_at: new Date(Date.now() - 120000),
      usersUpVoted: [1, 2],
      usersDownVoted: []
    },
    {
      title: 'You won\'t believe what these cats can do!',
      id: 2,
      votes: 0,
      comments: [],
      authorId: 1,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ' +
        'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
        'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
        'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
      created_at: new Date(),
      imageUrl: 'assets/kitten.jpg',
      usersUpVoted: [],
      usersDownVoted: []
    },
  ];
  private posts$ = new BehaviorSubject<Post[]>(this.sortedPosts());

  public emitPosts() {
    this.posts$.next(this.sortedPosts());
  }

  public sortedPosts() {
    return this.posts.slice().sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  public getPosts() {
    return this.posts$.asObservable();
  }

  public getPostById(id: number) {
    return this.posts.find(post => post.id === id);
  }

  public getPostObservableById(id: number) {
    return of(this.posts.find(post => post.id === id));
  }

  public createPost(authorId: number, title: string, content: string, imageUrl?: string) {
    return new Promise((resolve, reject) => {
      const newPost = new Post(authorId, title, content);
      if (imageUrl) {
        newPost.imageUrl = imageUrl;
      }
      this.posts.push(newPost);
      this.emitPosts();
      resolve();
    });
  }

  public modifyPost(postToModify: Post, userId: number) {
    return new Promise((resolve, reject) => {
      const foundPost = this.getPostById(postToModify.id);
      if (!foundPost || foundPost.authorId !== userId) {
        reject('Cannot modify post!');
      } else {
        this.posts[this.posts.findIndex(post => post.id === postToModify.id)] = postToModify;
        this.emitPosts();
        resolve();
      }
    });
  }

  public deletePost(postId: number, userId: number) {
    return new Promise((resolve, reject) => {
      const foundPost = this.getPostById(postId);
      if (!foundPost || foundPost.authorId !== userId) {
        reject('Cannot modify post!');
      } else {
        this.posts.splice(this.posts.indexOf(foundPost), 1);
        this.emitPosts();
        resolve();
      }
    });
  }

  public addCommentToPost(postId: number, comment: Comment) {
    return new Promise((resolve, reject) => {
      const foundPost = this.getPostById(postId);
      if (!foundPost) {
        reject('Could not find post!');
      } else {
        foundPost.comments.push(comment);
        this.emitPosts();
        resolve();
      }
    });
  }

  public adjustVote(postId: number, vote: number, userId: number) {
    return new Promise((resolve, reject) => {
      const foundPost = this.getPostById(postId);
      if (!foundPost) {
        reject('Could not find post!');
      } else {
        const userAlreadyUpVoted = foundPost.usersUpVoted.find(id => id === userId);
        const userAlreadyDownVoted = foundPost.usersDownVoted.find(id => id === userId);
        if ((userAlreadyUpVoted && vote > 0) || (userAlreadyDownVoted && vote < 0)) {
          reject('You already voted that way!');
        } else if (userAlreadyUpVoted && vote < 0) {
          foundPost.usersUpVoted.splice(foundPost.usersUpVoted.indexOf(userAlreadyUpVoted));
          foundPost.votes--;
        } else if (userAlreadyDownVoted && vote > 0) {
          foundPost.usersDownVoted.splice(foundPost.usersDownVoted.indexOf(userAlreadyDownVoted));
          foundPost.votes++;
        } else if (vote > 0) {
          foundPost.usersUpVoted.push(userId);
          foundPost.votes++;
        } else if (vote < 0) {
          foundPost.usersDownVoted.push(userId);
          foundPost.votes--;
        }
        this.emitPosts();
        resolve();
      }
    });
  }
  public adjustCommentVote(postId: number, commentId: number, vote: number, userId: number) {
    return new Promise((resolve, reject) => {
      const foundPost = this.getPostById(postId);
      if (!foundPost) {
        reject('Could not find post!');
      } else {
        const foundComment = foundPost.comments.find(comment => comment.id === commentId);
        if (!foundComment) {
          reject('Could not find comment!');
        } else {
          const userAlreadyUpVoted = foundComment.usersUpVoted.find(id => id === userId);
          const userAlreadyDownVoted = foundComment.usersDownVoted.find(id => id === userId);
          if ((userAlreadyUpVoted && vote > 0) || (userAlreadyDownVoted && vote < 0)) {
            reject('You already voted that way!');
          } else if (userAlreadyUpVoted && vote < 0) {
            foundComment.usersUpVoted.splice(foundPost.usersUpVoted.indexOf(userAlreadyUpVoted));
            foundComment.votes--;
          } else if (userAlreadyDownVoted && vote > 0) {
            foundComment.usersDownVoted.splice(foundPost.usersDownVoted.indexOf(userAlreadyDownVoted));
            foundComment.votes++;
          } else if (vote > 0) {
            foundComment.usersUpVoted.push(userId);
            foundComment.votes++;
          } else if (vote < 0) {
            foundComment.usersDownVoted.push(userId);
            foundComment.votes--;
          }
          this.emitPosts();
          resolve();
        }
      }
    });
  }
}
