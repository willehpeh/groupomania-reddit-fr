import { Injectable } from '@angular/core';
import { Post } from '../models/Post.model';
import { Comment } from '../models/Comment.model';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { post } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [
    {
      title: 'The best place to buy hot sauce',
      id: 1,
      votes: 2,
      comments: [
        new Comment(2, 1, 'I dunno man, I think it sucks')
      ],
      authorId: 1,
      content: 'Dream about hunting birds destroy couch, for mice spread kitty litter all over house. ' +
        'Cough hairball on conveniently placed pants. Destroy the blinds cough furball into food bowl ' +
        'then scratch owner for a new one damn that dog and eat the fat cats food warm up laptop with ' +
        'butt lick butt fart rainbows until owner yells pee in litter box hiss at cats. Lick the other ' +
        'cats hack up furballs destroy couch as revenge. Where is my slave?',
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
      content: 'I\'m getting hungry cat meoooow i iz master of hoomaan, not hoomaan master of i, oooh ' +
        'damn dat dog annoy kitten brother with poking stare at the wall, play with food and get ' +
        'confused by dust scratch at fleas, meow until belly rubs, hide behind curtain when vacuum ' +
        'cleaner is on scratch strangers and poo on owners food or make meme, make cute face. ' +
        'Stretch with tail in the air missing until dinner time. I shredded your linens for you love ' +
        'to play with owner\'s hair tie and my cat stared at me he was sipping his tea, too crash ' +
        'against wall but walk away like nothing happened proudly present butt to human so i like ' +
        'big cats and i can not lie yet thug cat ',
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

  public modifyPost(postId: number, userId: number, newPost: Post) {
    return new Promise((resolve, reject) => {
      const foundPost = this.getPostById(postId);
      if (!foundPost || foundPost.authorId !== userId) {
        reject('Cannot modify post!');
      } else {
        newPost.comments = foundPost.comments;
        newPost.id = foundPost.id;
        this.posts[this.posts.findIndex(post => post.id === postId)] = newPost;
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

  public deleteComment(postId: number, commentId: number, userId: number) {
    return new Promise((resolve, reject) => {
      const foundPost = this.getPostById(postId);
      if (!foundPost) {
        reject('Cannot find post!');
      } else {
        const foundComment = foundPost.comments.find(commentEl => commentEl.id === commentId);
        if (!foundComment || foundComment.authorId !== userId) {
          reject('You are not allowed to delete that comment!');
        } else {
          this.posts[this.posts.indexOf(foundPost)].comments.splice(foundPost.comments.indexOf(foundComment), 1);
          this.emitPosts();
          resolve();
        }
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
            foundComment.usersUpVoted.splice(foundComment.usersUpVoted.indexOf(userAlreadyUpVoted));
            foundComment.votes--;
          } else if (userAlreadyDownVoted && vote > 0) {
            foundComment.usersDownVoted.splice(foundComment.usersDownVoted.indexOf(userAlreadyDownVoted));
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
