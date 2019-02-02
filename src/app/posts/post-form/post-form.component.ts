import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { User } from '../../models/User.model';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  public postForm: FormGroup;
  public imagePreview: string;
  public currentUser: User;
  public errorMsg: string;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private posts: PostsService,
              private router: Router) { }

  ngOnInit() {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
    this.currentUser = this.auth.getCurrentUser();
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

  onCancel() {
    this.router.navigateByUrl('/home');
  }

  onSubmit() {
    const authorId = this.currentUser.id;
    const title = this.postForm.get('title').value;
    const content = this.postForm.get('content').value;
    this.posts.createPost(authorId, title, content)
      .then(
        () => {
          this.router.navigateByUrl('/home');
        }
      ).catch(
      (error) => {
        this.errorMsg = error;
      }
    );
  }
}
