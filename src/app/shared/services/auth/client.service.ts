import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ClientService {
	private isClientLoggedIn: any;
	private server = environment.server;

	private clientStatus = new BehaviorSubject<any>(null || localStorage.getItem('clientLogin'));
	public clientStatus$ = this.clientStatus.asObservable();

  	constructor(private http: Http, 
  		private router: Router) {
  	}

  	// error handler
  	private handleError(error:any, caught:any): any{
  		localStorage.setItem('notFound', 'true');
  		throw error;
  	}

  	// error handler authorize
  	private handleErrorAuthorize(error:any, caught:any): any{
  		localStorage.setItem('notFound', 'true');
  		throw error;
  	}


  	// Get client login form
	getClientLoginForm(): Observable<any>{
		return this.http
		.get(`${this.server}/api/client/signin`)
		.pipe(
			map(res => res.json()),
			catchError(this.handleError)
		);
	}

	// post login client
	postLogin(body: any): Observable<any>{
		return this.http
		.post(`${this.server}/api/client/signin`, body, { /*withCredentials : true*/ })
		.pipe(
			map(res => res.json()),
			catchError(this.handleError)
		);
	}

	// get signup form
	getClientSignupForm(): Observable<any>{
		return this.http
		.get(`${this.server}/api/client/signup`)
		.pipe(
			map(res => res.json()),
			catchError(this.handleError)
		);
	}

	// post signup client
	postSignUp(body: any): Observable<any>{
		return this.http
		.post(`${this.server}/api/client/signup`, body)
		.pipe(
			map(res => res.json()),
			catchError(this.handleError)
		);
	}

	// get login status from session storage
	getClientProfile(): any {
		return this.http
		.get(`${this.server}/api/client/profile`)
		.pipe(
			map(res => res.json()),
			catchError(this.handleErrorAuthorize)
		);
	}

	// get refresh token
	getRefreshToken(): any {
		if(localStorage.getItem('refreshToken')){
			return this.http
			.post(`${this.server}/api/client/token/refresh`, 
				JSON.stringify({ 
					client: localStorage.getItem('client'),
					refreshToken: localStorage.getItem('refreshToken') 
				})
			)
			.pipe(
				map(res => res.json()),
				catchError(this.handleErrorAuthorize)
			);
		} else return of(false);
		
	}

	// get login status from session storage
	getClientLoginStatus(): any  {
		let storedItem:any = localStorage.getItem('clientLogin');

		if(!!storedItem && storedItem != 'false') return true; 
		else return false;
	}

	// logout client
	logoutClient(): Observable<any>{
		return this.http
		.get(`${this.server}/api/client/logout`)
		.pipe(
			map(res => {
				localStorage.clear();
				this.isClientLoggedIn = false;
				this.clientStatus.next(undefined);
				this.router.navigate(['/client/signin']);
				return res.json();
			}),
			catchError(this.handleError)
		);
	}

	// set login status to true in local storage
	setClientLogin(status: any): void {
		this.clientStatus.next(status);
		localStorage.setItem('clientLogin', status);
		this.isClientLoggedIn = true;
	}

}
