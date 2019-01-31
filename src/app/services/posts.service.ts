import { Injectable } from '@angular/core';
import { Post } from '../models/Post.model';
import { Comment } from '../models/Comment.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [
    {
      title: 'The best place to buy hot sauce',
      id: 1,
      votes: 56,
      comments: [],
      authorId: 1,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ' +
        'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
        'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
        'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat',
      created_at: new Date()
    },
  ];
  public posts$ = new BehaviorSubject<Post[]>(this.posts.slice());

  public emitPosts() {
    this.posts$.next(this.posts.slice());
  }

  public getPosts() {
    return this.posts$.asObservable();
  }

  public getPostById(id: number) {
    return this.posts.find(post => post.id === id);
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

  public adjustVote(postId: number, vote: number) {
    return new Promise((resolve, reject) => {
      const foundPost = this.getPostById(postId);
      if (!foundPost) {
        reject('Could not find post!');
      } else {
        foundPost.votes += vote;
        this.emitPosts();
        resolve();
      }
    });
  }
}
