import { Routes } from '@angular/router';
import { ProfileComponent } from './users/profile/profile.component';
import { SigninComponent } from './users/signin/signin.component';
import { SignupComponent } from './users/signup/signup.component';
import { UserGuard } from '../../shared/guard/auth/user.guard';

export const UserRoutes: Routes = [
  { 
  	path: 'signin',
  	component: SigninComponent
  },
  { 
  	path: 'signup', 
  	component: SignupComponent 
  },
  { 
  	path: 'profile', 
  	component: ProfileComponent,
  	canActivate: [UserGuard]
  },
];
