import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { environment } from '../../../../environments/environment';
import { UserRoutes } from './user.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forChild(UserRoutes)
  ],
  declarations: [
  	SigninComponent, 
  	SignupComponent, 
  	ProfileComponent, 
  ]
})
export class UserModule { }
