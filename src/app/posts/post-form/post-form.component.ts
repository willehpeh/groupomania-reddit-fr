import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User.model';
import { Post } from '../../models/Post.model';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  public mode: string;
  private post: Post;
  public postForm: FormGroup;
  public imagePreview: string;
  public currentUser: User;
  public errorMsg: string;
  private imageAdded: boolean;
  private imageModified: boolean;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private posts: PostsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.mode = 'edit';
      this.post = this.posts.getPostById(+this.route.snapshot.params['id']);
      this.imageModified = false;
      this.postForm = this.formBuilder.group({
        title: [this.post.title, Validators.required],
        content: [this.post.content, Validators.required]
      });
      if (this.post.imageUrl) {
        this.imagePreview = this.post.imageUrl;
        this.imageAdded = true;
      } else {
        this.imageAdded = false;
      }
    } else {
      this.mode = 'new';
      this.postForm = this.formBuilder.group({
        title: ['', Validators.required],
        content: ['', Validators.required]
      });
      this.imageAdded = false;
    }
    this.currentUser = this.auth.getCurrentUser();
  }

  generateRandomKitten() {
    const randomInt = Math.floor(Math.random() * 10 + 1);
    return `assets/kitten${randomInt}.jpg`;
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.imageAdded = true;
    if (this.mode === 'edit') {
      this.imageModified = true;
    }
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
    if (this.mode === 'new') {
      if (this.imageAdded) {
        this.posts.createPost(authorId, title, content, this.generateRandomKitten())
          .then(
            () => {
              this.router.navigateByUrl('/home');
            }
          ).catch(
          (error) => {
            this.errorMsg = error;
          }
        );
      } else {
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
    } else {
      const newPost = this.imageModified ?
        new Post(this.currentUser.id, title, content, this.generateRandomKitten()) :
        new Post(this.currentUser.id, title, content, this.post.imageUrl);
      this.posts.modifyPost(this.post.id, this.currentUser.id, newPost)
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
}
