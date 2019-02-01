import { Comment } from './Comment.model';

export class Post {
  public id: number;
  public votes: number;
  public comments: Comment[];
  public created_at: Date;
  public usersUpVoted: number[];
  public usersDownVoted: number[];
  constructor(public authorId: number, public title: string, public content: string, public imageUrl?: string) {
    this.id = Date.now();
    this.votes = 0;
    this.comments = [];
    this.created_at = new Date();
    this.usersUpVoted = [];
    this.usersDownVoted = [];
  }
}
