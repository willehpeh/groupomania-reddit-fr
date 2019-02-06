import { Component, OnInit } from '@angular/core';
import { User } from '../models/User.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$: Observable<User>;
  public currentUser: User;
  public showEditButtons: boolean;
  public showDeleteModal: boolean;
  public errorMsg: string;

  constructor(private route: ActivatedRoute,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.showDeleteModal = false;
    this.currentUser = this.auth.getCurrentUser();
    const userId = this.route.snapshot.params['id'];
    if (userId && +userId !== this.currentUser.id) {
      this.showEditButtons = false;
      this.user$ = this.auth.getUserInfo(+userId);
    } else {
      this.showEditButtons = true;
      this.user$ = this.auth.getUserInfo(+this.currentUser.id);
    }
  }

  onEditProfile() {
    this.router.navigateByUrl('profile/edit');
  }

  onShowDeleteModal() {
    this.showDeleteModal = true;
  }

  onCloseModal() {
    this.showDeleteModal = false;
  }

  onDeleteProfile() {
    this.auth.deleteUser(this.currentUser.id)
      .then(() => {
        this.auth.logout();
        this.router.navigateByUrl('/auth/login');
      })
      .catch(error => this.errorMsg = error);
  }

  nothing(event: Event) {
    event.stopPropagation();
  }

}
