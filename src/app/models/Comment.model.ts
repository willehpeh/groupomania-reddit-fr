export class Comment {
  public id: number;
  public votes: number;
  public createdDate: Date;
  public subcomments: Comment[];
  public usersUpVoted: number[];
  public usersDownVoted: number[];
  constructor(public authorId: number, public postId: number, public content: string) {
    this.id = Date.now();
    this.votes = 0;
    this.createdDate = new Date();
    this.subcomments = [];
    this.usersUpVoted = [];
    this.usersDownVoted = [];
  }
}
