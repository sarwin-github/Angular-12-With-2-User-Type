import { RequestOptions, BaseRequestOptions, RequestOptionsArgs } from '@angular/http';
import { Injectable } from "@angular/core";

@Injectable()
export class CustomRequestOptions extends BaseRequestOptions {

    constructor() {
        super();
        this.headers.set('Content-Type', 'application/json');
    }
    merge(options?: RequestOptionsArgs): RequestOptions {
        const token = localStorage.getItem('token');
        const newOptions = super.merge(options);
        
        if (token) {
            newOptions.headers.set('Authorization', `${token}`);
        }

        return newOptions;
    }
}