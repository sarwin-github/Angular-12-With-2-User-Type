import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../../shared/services/auth/users.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  animations: [mainAnimations],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
	private req     : Subscription;
	private postReq : Subscription;
	private loginReq : Subscription;

	user           : IUserInput;
	userSignupForm : FormGroup;
	message        : string;
	error          : string;

  	constructor(private router:Router, 
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private UsersService: UsersService) { 
  		this.user = <IUserInput>{};
  	}

  	ngOnInit() {
  		this.createForm();
  	}

  	createForm(){
  		this.req = this.UsersService.getUserSignupForm().subscribe((data) => {
			console.log(data);
		});

  		this.userSignupForm = this.formBuilder.group({
	      'email'      : [null, Validators.compose([Validators.required, Validators.email])],
	      'password'   : [null, Validators.compose([Validators.required, Validators.minLength(6)])],
	      'confirmPassword' : [null, Validators.compose([Validators.required, Validators.minLength(6)])],
	      'name'       : [null, Validators.compose([Validators.required])],
	      'address'    : [null, Validators.compose([Validators.required])],
	      'phone'      : [null, Validators.compose([Validators.required])]
	    });
  	}

  	/* signupUser - create new user
	* parameter
	* 	- @event : event value
	*/

	signUpUser(e){
		this.user.email           = this.userSignupForm.get('email').value;
		this.user.password        = this.userSignupForm.get('password').value;
		this.user.confirmPassword = this.userSignupForm.get('confirmPassword').value;
		this.user.name            = this.userSignupForm.get('name').value;
		this.user.address         = this.userSignupForm.get('address').value;
		this.user.phone         = this.userSignupForm.get('phone').value;

		// initialize inputs
	  	let body  = {
	  		'email'    : this.user.email,
	  		'password' : this.user.password,
	  		'confirm-password': this.user.confirmPassword,
	  		'name'     : this.user.name,
	  		'address'  : this.user.address,
	  		'phone'    : this.user.phone
	  	};

		// execute http post request
		this.postReq = this.UsersService.postSignUp(JSON.stringify(body))
		.subscribe((result) => {
	  		// if error then throw error result 
	  		if(result.error){
	  			window.scroll(0, 0);
	  			localStorage.setItem('signupError', result.error);

	  			this.error = localStorage.getItem('signupError');
  			    return this.router.navigate(['user/signup']);
	  		} 
	  		// if no error, execute login validation
	  		else {
	  			localStorage.removeItem('signupError');

	  			// After successful signup execute login request to server
    			this.loginUser(result, body);
	  		}
	  	},
	  	// If error in server/api temporary navigate to error page
		(err) => {
			localStorage.setItem('sessionError', err);
			localStorage.setItem('sessionUrl', this.router.url);
			console.log(err)
		});	  
	}

	// login user
	loginUser(result, body){
		this.loginReq = this.UsersService.postLogin(JSON.stringify(body))
		.subscribe((user) => {
  			localStorage.setItem('loginMessage', 'Login was successful.');
  			localStorage.setItem('token', 'Bearer ' + user.token);
  			localStorage.setItem('refreshToken', result.refreshToken);
  			localStorage.setItem('user', JSON.stringify({
				_id: result.user._id,
				name: result.user.name,
				email: result.user.email
			}));

  			this.userSignupForm.reset();
  			this.message = localStorage.getItem('loginMessage');
	    	this.UsersService.setUserLogin(true);
			this.router.navigate(['/user/profile']);
		});
	}

	// Clear error message
	onAlertClose(): void {
		localStorage.removeItem('signupError');
		localStorage.removeItem('signupMessage');
	   	this.error   = undefined;
	   	this.message = undefined;
	}

	ngOnDestroy(){
		localStorage.removeItem('signupError');
		localStorage.removeItem('signupMessage');

		if(this.postReq) this.postReq.unsubscribe();
		if(this.loginReq) this.loginReq.unsubscribe();
	}

}

interface IUserInput{
	name            : string;
	email           : string;
	password        : string;
	confirmPassword : string;
	address         : string;
	phone           : string;
}