import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { mainAnimations } from '../../shared/animations/main-animations';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-home',
	animations: [mainAnimations],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	constructor() { }

    ngOnInit() {
    }

	ngOnDestroy(){
	}

}
