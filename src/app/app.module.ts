import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostViewComponent } from './posts/post-view/post-view.component';
import { PostFormComponent } from './posts/post-form/post-form.component';
import { CommentComponent } from './posts/comment/comment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostListItemComponent } from './posts/post-list/post-list-item/post-list-item.component';
import { ProfileComponent } from './profile/profile.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    PostListComponent,
    PostViewComponent,
    PostFormComponent,
    CommentComponent,
    PostListItemComponent,
    ProfileComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
