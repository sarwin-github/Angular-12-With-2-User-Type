import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../../shared/services/auth/client.service'
import { mainAnimations } from '../../../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'profile-client',
  animations: [mainAnimations],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private req : Subscription;
	client_data: any = {};

  	constructor(private router:Router, 
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private clientService: ClientService) { }

  	ngOnInit() {
  		this.getClientProfile();
  	}

  	getClientProfile(){
  		this.req = this.clientService.getClientProfile()
      .subscribe((result) => {
  			this.client_data = result;
  			console.log(result)
  		},
	  	// If error in server/api temporary navigate to error page
		  (err) => {
  			localStorage.setItem('sessionError', err);
  			localStorage.setItem('sessionUrl', this.router.url);
  			console.log(err)
        this.clientService.logoutClient();
		  });	 
  	}

  	ngOnDestroy(){
  		this.req.unsubscribe();
  	}

}
