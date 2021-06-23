import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ClientService } from '../../services/auth/client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
	constructor(private clientService: ClientService, private router: Router){}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.clientService.getRefreshToken().pipe(map(result => {
		    if(!JSON.parse(JSON.stringify(result)).refreshToken){ 
		    	localStorage.setItem('loginError', "You are not allowed to access this URL. Please login to continue.");
		    	localStorage.setItem('returnURL', this.router.url);
		    	this.clientService.logoutClient().subscribe(res => res);
		    	this.router.navigate(['/client/signin']);
		    	return false;
		    }
		    else {
		    	console.log("REFRESH TOKEN", result)
		    	
		    	localStorage.setItem('refreshTokenMessage', 'Refresh Token was successful.');
		    	localStorage.setItem('token', 'Bearer ' + JSON.parse(JSON.stringify(result)).refreshToken);
		    	return true;
		    }
		}));
	}
  
}
