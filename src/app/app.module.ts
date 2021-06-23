import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { UserGuard } from './shared/guard/auth/user.guard';
import { CustomRequestOptions } from './shared/services/set-auth-header';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routing';

@NgModule({
    declarations: [
      AppComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forRoot(rootRouterConfig, { useHash: false, relativeLinkResolution: 'legacy' })
    ],
    providers: [UserGuard, { provide: RequestOptions, useClass: CustomRequestOptions }],
    bootstrap: [AppComponent]
})
export class AppModule { }
