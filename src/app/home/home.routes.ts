import { Routes } from '@angular/router';
import { DashboardComponent } from './../home/dashboard/dashboard.component';
import { AuthGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
];
