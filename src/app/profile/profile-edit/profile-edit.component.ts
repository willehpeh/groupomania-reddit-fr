import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/User.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User;
  public imageThumbnail: string;
  public errorMsg: string;
  public imageChanged: boolean;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.imageChanged = false;
    this.user = this.auth.getCurrentUser();
    this.imageThumbnail = this.user.photoUrl;
    this.profileForm = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, Validators.required]
    });
  }

  generateRandomKitten() {
    const randomInt = Math.floor(Math.random() * 10 + 1);
    return `assets/kitten${randomInt}.jpg`;
  }

  onChooseImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageThumbnail = <string>reader.result;
    };
    reader.readAsDataURL(file);
    this.imageChanged = true;
  }

  onSubmitProfile() {
    this.user.username = this.profileForm.get('username').value;
    this.user.email = this.profileForm.get('email').value;
    if (this.imageChanged) {
      this.user.photoUrl = this.generateRandomKitten();
    }
    this.auth.modifyUser(this.user)
      .then(() => this.router.navigateByUrl('profile/me'))
      .catch(error => this.errorMsg = error);
  }

  onGoBack() {
    this.router.navigateByUrl('profile/me');
  }
}
