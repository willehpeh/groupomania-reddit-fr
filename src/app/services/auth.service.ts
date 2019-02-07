import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      photoUrl: './assets/user.png',
      email: 'test@test.com',
      password: 'testtest',
      username: 'penguinzrulezOK'
    },
    {
      id: 2,
      photoUrl: './assets/user.png',
      email: 'test2@test.com',
      password: 'testtest',
      username: 'lulznope'
    }
  ];
  public isAuth = false;
  public currentUser: User;

  public getUserInfo(userId: number) {
    return of(this.users.find(user => user.id === userId));
  }

  public getAllUsers() {
    return of(this.users.slice());
  }

  public getCurrentUser() {
    return this.currentUser;
  }

  public authenticateUser(user: User) {
    this.isAuth = true;
    this.currentUser = user;
  }

  public login(username: string, password: string) {
    return new Promise((resolve, reject) => {
      const foundUser = this.users.find(user => user.username === username);
      if (!foundUser) {
        reject('Utilisateur non trouvé !');
      } else if (foundUser && password !== foundUser.password) {
        reject('Mot de passe incorrect !');
      } else {
        this.authenticateUser(foundUser);
        resolve();
      }
    });
  }

  public signup(username: string, email: string, password: string, photoUrl?: string) {
    return new Promise((resolve, reject) => {
      if (this.users.find(user => user.username === username) ||
        this.users.find(user => user.email === email)) {
        reject('Cet utilisateur existe déjà !');
      } else {
        const newUser = new User(username, email, password);
        if (photoUrl) {
          newUser.photoUrl = photoUrl;
        }
        this.users.push(newUser);
      }
      this.login(username, password).then(() => resolve()).catch((error) => reject(error));
    });
  }

  public logout() {
    this.isAuth = false;
    this.currentUser = null;
  }

  public modifyUser(modifiedUser: User) {
    return new Promise((resolve, reject) => {
      const index = this.users.findIndex(user => user.id === modifiedUser.id);
      this.users[index] = modifiedUser;
      resolve();
    });
  }

  public deleteUser(userId: number) {
    return new Promise((resolve, reject) => {
      this.users.splice(this.users.findIndex(user => user.id === userId));
      resolve();
    });
  }
}
