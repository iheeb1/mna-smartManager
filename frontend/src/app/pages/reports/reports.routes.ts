import { Routes } from '@angular/router';
import { ReportsComponent } from './components/reports.component';
import { ChecksComponent } from './components/checks/checks.component';

export const REPORTS_ROUTES: Routes = [
    {
        path: '',
        component: ReportsComponent
    },
    {
        path: 'checks',
        component: ChecksComponent
    }
];