import { Routes } from '@angular/router';
import { UserGuard } from './shared/guard/auth/user.guard';
import { HeaderComponent } from './shared/components/header/header.component';

export const rootRouterConfig: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: '',
        loadChildren: './views/home/home.module#HomeModule'
      }
    ]
  },
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'user',
        loadChildren: './views/auth/users/user.module#UserModule'
      }
    ]
  },

  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'client',
        loadChildren: './views/auth/clients/client.module#ClientModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];
