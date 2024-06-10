import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { DesignationsComponent } from './designations/designations.component';

export const routes: Routes = [
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'designations', component: DesignationsComponent, canActivate: [AuthGuard] },
];
