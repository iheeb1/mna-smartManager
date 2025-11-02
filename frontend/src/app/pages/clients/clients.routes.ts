import { Routes } from '@angular/router';
import { ClientsComponent } from './components/clients.component';
import { ClientDetailsComponent } from './components/clients/client-details/client-details.component';


export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    component: ClientsComponent
  },
  {
    path: ':id',
    component: ClientDetailsComponent
  }
];