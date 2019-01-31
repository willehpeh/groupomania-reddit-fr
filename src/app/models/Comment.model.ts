export class Comment {
  public id: number;
  public votes: number;
  public createdDate: Date;
  public subcomments: Comment[];
  constructor(public authorId: number, public content: string) {
    this.id = Date.now();
    this.votes = 0;
    this.createdDate = new Date();
    this.subcomments = [];
  }
}
