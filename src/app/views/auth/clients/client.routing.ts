import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ClientGuard } from '../../../shared/guard/auth/client.guard';

export const ClientRoutes: Routes = [
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
  	canActivate: [ClientGuard]
  },
];
