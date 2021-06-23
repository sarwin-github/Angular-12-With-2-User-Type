import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../../shared/services/auth/users.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  animations: [mainAnimations],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
	private req : Subscription;
	private postReq : Subscription;
	public userLoginForm : FormGroup;

	user_email : string;
	user_password : string;
	message	: string = localStorage.getItem('loginMessage');
	error	: string = localStorage.getItem('loginError');


  	constructor(private router:Router, 
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private UsersService: UsersService) { }

  	ngOnInit() {
  		this.createForm();
  	}

  	createForm(){
  		this.userLoginForm = this.formBuilder.group({
	      'email'      : [null, Validators.compose([Validators.required, Validators.email])],
	      'password'   : [null, Validators.compose([Validators.required, Validators.minLength(6)])]
	    });

	    this.req = this.UsersService.getUserLoginForm().subscribe((data) => {
			console.log(data);
		});
  	}

  	loginUser(e){
		//get value from form controls
		this.user_email    = this.userLoginForm.get('email').value;
		this.user_password = this.userLoginForm.get('password').value;
		
		// initialize inputs
	  	let body  = {
	  		'email'    : this.user_email,
	  		'password' : this.user_password,
	  	};

		// execute http post request
		this.postReq = this.UsersService
		.postLogin(JSON.stringify(body))
		.subscribe((result) => {
	  		// if error then throw error result 
	  		if(result.error){
	  			console.log("ERROR", result)

	  			window.scroll(0, 0);
	  			localStorage.setItem('loginError', result.error);

	  			this.error = localStorage.getItem('loginError');
	  			//this.error = this.error.split(',').join('<br>');
  			    return this.router.navigate(['/user/signin']);
	  		} 

	  		// if no error, execute login validation
	  		else {
	  			localStorage.removeItem('loginError');
	  			localStorage.setItem('loginMessage', 'Login was successful.');
	  			localStorage.setItem('token', 'Bearer ' + result.token);
	  			localStorage.setItem('token_authorization', /*'Bearer ' + */result.token.replace('Bearer ', ''));
	  			
	  			localStorage.setItem('refreshToken', result.refreshToken);
	  			localStorage.setItem('user', JSON.stringify({
					_id: result.user._id,
					name: result.user.name,
					email: result.user.email
				}));

	  			this.userLoginForm.reset();
	  			this.message = localStorage.getItem('loginMessage');
    	    	this.UsersService.setUserLogin(true);
    			this.router.navigate(['/user/profile']);
	  		}
	  	},
	  	// If error in server/api temporary navigate to error page
		(err) => {
			localStorage.setItem('sessionError', err);
			localStorage.setItem('sessionUrl', this.router.url);
			console.log(err)
		});	  
	}

	// Clear error message
	onAlertClose(): void {
		localStorage.removeItem('loginError');
		localStorage.removeItem('loginMessage');
	   	this.error   = undefined;
	   	this.message = undefined;
	}

  	ngOnDestroy(){
  		localStorage.removeItem('loginError');
		localStorage.removeItem('loginMessage');
  		
    	this.req.unsubscribe();
  	}

}
