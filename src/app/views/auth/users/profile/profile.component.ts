import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../../shared/services/auth/users.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  animations: [mainAnimations],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	private req : Subscription;
	user_data: any = {};

  	constructor(private router:Router, 
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private UsersService: UsersService) { }

  	ngOnInit() {
  		this.getUserProfile();
  	}

  	getUserProfile(){
  		this.req = this.UsersService.getUserProfile()
      .subscribe((result) => {
  			this.user_data = result;
  			console.log(result)
  		},
	  	// If error in server/api temporary navigate to error page
		  (err) => {
  			localStorage.setItem('sessionError', err);
  			localStorage.setItem('sessionUrl', this.router.url);
  			console.log(err)
        this.UsersService.logoutUser();
		  });	 
  	}

  	ngOnDestroy(){
  		this.req.unsubscribe();
  	}

}
