import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', loadChildren: () => import('./home/home.routes').then((m) => m.routes) },
    { path: 'masters', loadChildren: () => import('./modules/masters/masters.routes').then((m) => m.routes) },
];
