import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/auth/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'header-nav',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	private req: Subscription;
	loggedInUser: any;

  	constructor(private router:Router, 
		private activatedRoute: ActivatedRoute,
		private UsersService: UsersService) { 
  		this.router.events.subscribe(event => {
			this.UsersService.userStatus$.subscribe(result => {
				this.loggedInUser = result;
			});
		});
  	}

  	ngOnInit() {
  	}

  	userLogout(){
		this.req = this.UsersService
			.logoutUser()
			.subscribe((data) => {
				window.scrollTo(0, 0);
		});
	}

	ngOnDestroy(){
		if(this.req) this.req.unsubscribe();
	}

}
