import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportsComponent } from './components/reports/reports.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/login', 
        pathMatch: 'full' 
    },
    { 
        path: 'login', 
        component: LoginComponent 
    },
    { 
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [authGuard] 
    },
    { 
        path: 'reports', 
        component: ReportsComponent, 
        canActivate: [authGuard] 
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];