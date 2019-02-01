export class User {
  public id: number;
  public photoUrl: string;
  constructor(public username: string, public email: string, public password: string) {
    this.id = Date.now();
    this.photoUrl = './assets/user.png';
  }
}
