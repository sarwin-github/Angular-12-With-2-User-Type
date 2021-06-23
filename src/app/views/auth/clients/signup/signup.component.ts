import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../../shared/services/auth/client.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
	selector: 'signup-client',
	animations: [mainAnimations],
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

	private req     : Subscription;
	private postReq : Subscription;
	private loginReq : Subscription;

	client           : IClientInput;
	clientSignupForm : FormGroup;
	message        : string;
	error          : string;

	constructor(private router:Router, 
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private clientService: ClientService) { 
		this.client = <IClientInput>{};
	}

	ngOnInit() {
		this.createForm();
	}

	createForm(){
		this.req = this.clientService.getClientSignupForm().subscribe((data) => {
			console.log(data);
		});

		this.clientSignupForm = this.formBuilder.group({
			'email'      : [null, Validators.compose([Validators.required, Validators.email])],
			'password'   : [null, Validators.compose([Validators.required, Validators.minLength(6)])],
			'confirmPassword' : [null, Validators.compose([Validators.required, Validators.minLength(6)])],
			'name'       : [null, Validators.compose([Validators.required])],
			'company'       : [null, Validators.compose([Validators.required])],
			'address'    : [null, Validators.compose([Validators.required])],
			'phone'      : [null, Validators.compose([Validators.required])]
		});
	}

  	/* signupClient - create new client
	* parameter
	* 	- @event : event value
	*/

	signUpClient(e){
		this.client.email           = this.clientSignupForm.get('email').value;
		this.client.password        = this.clientSignupForm.get('password').value;
		this.client.confirmPassword = this.clientSignupForm.get('confirmPassword').value;
		this.client.name            = this.clientSignupForm.get('name').value;
		this.client.company         = this.clientSignupForm.get('company').value;
		this.client.address         = this.clientSignupForm.get('address').value;
		this.client.phone           = this.clientSignupForm.get('phone').value;

		// initialize inputs
		let body  = {
			'email'    : this.client.email,
			'password' : this.client.password,
			'confirm-password': this.client.confirmPassword,
			'name'     : this.client.name,
			'company'  : this.client.company,
			'address'  : this.client.address,
			'phone'    : this.client.phone
		};

		// execute http post request
		this.postReq = this.clientService.postSignUp(JSON.stringify(body))
		.subscribe((result) => {
			console.log(result)

			// if error then throw error result 
			if(result.error){
				window.scroll(0, 0);
				localStorage.setItem('signupError', result.error);

				this.error = localStorage.getItem('signupError');
				return this.router.navigate(['client/signup']);
			} 
			// if no error, execute login validation
			else {
				localStorage.removeItem('signupError');

				// After successful signup execute login request to server
				this.loginClient(result, body);
			}
		},
		// If error in server/api temporary navigate to error page
		(err) => {
			localStorage.setItem('sessionError', err);
			localStorage.setItem('sessionUrl', this.router.url);
			console.log(err)
		});	  
	}

	// login client
	loginClient(result, body){
		this.loginReq = this.clientService.postLogin(JSON.stringify(body))
		.subscribe((client) => {
			localStorage.setItem('loginMessage', 'Login was successful.');
			localStorage.setItem('token', 'Bearer ' + client.token);
			localStorage.setItem('refreshToken', result.refreshToken);
			localStorage.setItem('client', JSON.stringify({
				_id: result.client._id,
				name: result.client.name,
				email: result.client.email
			}));

			this.clientSignupForm.reset();
			this.message = localStorage.getItem('loginMessage');
			this.clientService.setClientLogin(true);
			this.router.navigate(['/client/profile']);
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

interface IClientInput{
	name            : string;
	email           : string;
	company         : string;
	password        : string;
	confirmPassword : string;
	address         : string;
	phone           : string;
}