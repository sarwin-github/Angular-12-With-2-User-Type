import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';


@Injectable({
  	providedIn: 'root'
})
export class UsersService {
	private isUserLoggedIn: any;
	private server = environment.server;

	private userStatus = new BehaviorSubject<any>(null || localStorage.getItem('userLogin'));
	public userStatus$ = this.userStatus.asObservable();

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


  	// Get user login form
	getUserLoginForm(): Observable<any>{
		return this.http
		.get(`${this.server}/api/user/signin`)
		.pipe(
			map(res => res.json()),
			catchError(this.handleError)
		);
	}

	// post login user
	postLogin(body: any): Observable<any>{
		return this.http
		.post(`${this.server}/api/user/signin`, body, { /*withCredentials : true*/ })
		.pipe(
			map(res => res.json()),
			catchError(this.handleError)
		);
	}

	// get signup form
	getUserSignupForm(): Observable<any>{
		return this.http
		.get(`${this.server}/api/user/signup`)
		.pipe(
			map(res => res.json()),
			catchError(this.handleError)
		);
	}

	// post signup user
	postSignUp(body: any): Observable<any>{
		return this.http
		.post(`${this.server}/api/user/signup`, body)
		.pipe(
			map(res => res.json()),
			catchError(this.handleError)
		);
	}

	// get login status from session storage
	getUserProfile(): any {
		return this.http
		.get(`${this.server}/api/user/profile`)
		.pipe(
			map(res => res.json()),
			catchError(this.handleErrorAuthorize)
		);
	}

	// get refresh token
	getRefreshToken(): any {
		if(localStorage.getItem('refreshToken')){
			return this.http
			.post(`${this.server}/api/user/token/refresh`, 
				JSON.stringify({ 
					user: localStorage.getItem('user'),
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
	getUserLoginStatus(): any  {
		let storedItem:any = localStorage.getItem('userLogin');

		if(!!storedItem && storedItem != 'false') return true; 
		else return false;
	}

	// logout user
	logoutUser(): Observable<any>{
		return this.http
		.get(`${this.server}/api/user/logout`)
		.pipe(
			map(res => {
				localStorage.clear();
				this.isUserLoggedIn = false;
				this.userStatus.next(undefined);
				this.router.navigate(['/user/signin']);
				return res.json();
			}),
			catchError(this.handleError)
		);
	}

	// set login status to true in local storage
	setUserLogin(status: any): void {
		this.userStatus.next(status);
		localStorage.setItem('userLogin', status);
		this.isUserLoggedIn = true;
	}

	
}
