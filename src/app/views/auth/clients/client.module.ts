import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { environment } from '../../../../environments/environment';
import { ClientRoutes } from './client.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forChild(ClientRoutes)
  ],
  declarations: [
  	SigninComponent, 
  	SignupComponent, 
  	ProfileComponent, 
  ]
})
export class ClientModule { }
