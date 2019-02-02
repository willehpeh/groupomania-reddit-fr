import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthGuard } from './services/auth-guard.service';
import { PostViewComponent } from './posts/post-view/post-view.component';
import { PostFormComponent } from './posts/post-form/post-form.component';

const routes: Routes = [
  { path: 'home', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'post/new', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: 'post/:id', component: PostViewComponent, canActivate: [AuthGuard] },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
