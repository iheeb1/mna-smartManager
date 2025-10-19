import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; // Update path as needed

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/login', 
        pathMatch: 'full' 
    },
    { 
        path: 'login',
        loadChildren: () => import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES)
    },
    { 
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
        canActivate: [authGuard]
    },
    { 
        path: 'reports',
        loadChildren: () => import('./pages/reports/reports.routes').then(m => m.REPORTS_ROUTES),
        canActivate: [authGuard]
    },
    { 
        path: 'orders',
        loadChildren: () => import('./pages/orders/order.routes').then(m => m.ORDER_ROUTES),
        canActivate: [authGuard]
    },
    { 
        path: 'cars',
        loadChildren: () => import('./pages/cars/cars.routes').then(m => m.CARS_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];