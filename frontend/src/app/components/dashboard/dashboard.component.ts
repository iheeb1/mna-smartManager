import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HeaderComponent } from '../header/header.component';

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  amount: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, TagModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  customers: Customer[] = [
    {
      name: 'דניאל',
      email: 'Example@gmail.com',
      phone: '03-6123456',
      address: 'הבשמים 12, תל אביב',
      status: 'positive',
      amount: '2495₪'
    },
    {
      name: 'מיכל',
      email: 'info@anh-projects.co.il',
      phone: '05-7654321',
      address: 'רחוב הנשיא 45, תל אביב',
      status: 'negative',
      amount: '-20,450₪'
    },
    {
      name: 'יוסף',
      email: 'contact@gaerbuild.co.il',
      phone: '02-8765432',
      address: 'רחוב הרצל 12, רעננה',
      status: 'positive',
      amount: '1458₪'
    },
    {
      name: 'שרה',
      email: 'office@anv-building.co.il',
      phone: '04-9876543',
      address: 'רחוב הרצל 30, חיפה',
      status: 'negative',
      amount: '-5498₪'
    },
    {
      name: 'אברהם',
      email: 'info@golan-infrastructure.co.il',
      phone: '03-7654321',
      address: 'רחוב הנשיא 22, פתח תקווה',
      status: 'positive',
      amount: '579₪'
    }
  ];

  menuItems = [
    { icon: 'pi pi-th-large', label: 'ניהול'},
    { icon: 'pi pi-users', label: 'משתמשים'},
    { icon: 'pi pi-file', label: 'הדפסות'},
    { icon: 'pi pi-star', label: 'מיקום'}
  ];
}