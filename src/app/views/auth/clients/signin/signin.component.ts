import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../../shared/services/auth/client.service';
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
	selector: 'signin-client',
	animations: [mainAnimations],
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
	private req : Subscription;
	private postReq : Subscription;
	public clientLoginForm : FormGroup;

	client_email : string;
	client_password : string;
	message	: string = localStorage.getItem('loginMessage');
	error	: string = localStorage.getItem('loginError');


	constructor(private router:Router, 
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private clientService: ClientService) { }

	ngOnInit() {
		this.createForm();
	}

	createForm(){
		this.clientLoginForm = this.formBuilder.group({
			'email'      : [null, Validators.compose([Validators.required, Validators.email])],
			'password'   : [null, Validators.compose([Validators.required, Validators.minLength(6)])]
		});

		// check API 
		this.req = this.clientService.getClientLoginForm().subscribe((data) => {
			console.log(data);
		});
	}

	loginClient(e){
		//get value from form controls
		this.client_email    = this.clientLoginForm.get('email').value;
		this.client_password = this.clientLoginForm.get('password').value;
		
		// initialize inputs
		let body  = {
			'email'    : this.client_email,
			'password' : this.client_password,
		};

		// execute http post request
		this.postReq = this.clientService
		.postLogin(JSON.stringify(body))
		.subscribe((result) => {
			// if error then throw error result 
			if(result.error){
				console.log("ERROR", result)

				window.scroll(0, 0);
				localStorage.setItem('loginError', result.error);

				this.error = localStorage.getItem('loginError');
				//this.error = this.error.split(',').join('<br>');
				return this.router.navigate(['/client/signin']);
			} 

			// if no error, execute login validation
			else {
				localStorage.removeItem('loginError');
				localStorage.setItem('loginMessage', 'Login was successful.');
				localStorage.setItem('token', 'Bearer ' + result.token);
				localStorage.setItem('token_authorization', /*'Bearer ' + */result.token.replace('Bearer ', ''));

				localStorage.setItem('refreshToken', result.refreshToken);
				localStorage.setItem('client', JSON.stringify({
					_id: result.client._id,
					name: result.client.name,
					email: result.client.email
				}));

				this.clientLoginForm.reset();
				this.message = localStorage.getItem('loginMessage');
				this.clientService.setClientLogin(true);
				this.router.navigate(['/client/profile']);
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
