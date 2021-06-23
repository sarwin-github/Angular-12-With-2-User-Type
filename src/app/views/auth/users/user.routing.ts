import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { UserGuard } from '../../../shared/guard/auth/user.guard';

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
