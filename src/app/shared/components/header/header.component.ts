import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/auth/users.service';
import { ClientService } from '../../services/auth/client.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'header-nav',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	private req: Subscription;
	loggedInUser: any;
	loggedInClient: any;

  	constructor(private router:Router, 
		private activatedRoute: ActivatedRoute,
		private clientService: ClientService,
		private usersService: UsersService) { 
  		this.router.events.subscribe(event => {
			this.usersService.userStatus$.subscribe(result => {
				this.loggedInUser = result;
			});

			this.clientService.clientStatus$.subscribe(result => {
				this.loggedInClient = result;
			});
		});
  	}

  	ngOnInit() {
  	}

  	userLogout(){
		this.req = this.usersService
			.logoutUser()
			.subscribe((data) => {
				window.scrollTo(0, 0);
		});
	}

  	clientLogout(){
		this.req = this.clientService
			.logoutClient()
			.subscribe((data) => {
				window.scrollTo(0, 0);
		});
	}

	ngOnDestroy(){
		if(this.req) this.req.unsubscribe();
	}

}
