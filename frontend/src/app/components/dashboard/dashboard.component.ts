import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HeaderComponent } from '../header/header.component';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';

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
  imports: [CommonModule, CardModule, ButtonModule, TableModule, TagModule, HeaderComponent, FooterNavComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  customers: Customer[] = [
    {
      name: 'أحمد',
      email: 'ahmed@example.com',
      phone: '02-27361234',
      address: 'شارع التحرير 12، القاهرة',
      status: 'positive',
      amount: '2495 ج.م'
    },
    {
      name: 'فاطمة',
      email: 'fatima@projects.eg',
      phone: '010-12345678',
      address: 'شارع الجلاء 45، الإسكندرية',
      status: 'negative',
      amount: '-20,450 ج.م'
    },
    {
      name: 'محمد',
      email: 'mohamed@build.eg',
      phone: '012-87654321',
      address: 'شارع النيل 12، الجيزة',
      status: 'positive',
      amount: '1458 ج.م'
    },
    {
      name: 'مريم',
      email: 'maryam@construction.eg',
      phone: '011-98765432',
      address: 'شارع الهرم 30، الجيزة',
      status: 'negative',
      amount: '-5498 ج.م'
    },
    {
      name: 'عمر',
      email: 'omar@infrastructure.eg',
      phone: '015-76543210',
      address: 'شارع رمسيس 22، القاهرة',
      status: 'positive',
      amount: '579 ج.م'
    }
  ];

  menuItems = [
    { icon: 'pi pi-chart-bar', label: 'الإدارة' },
    { icon: 'pi pi-shopping-bag', label: 'المستخدمون' },
    { icon: 'pi pi-print', label: 'الطباعة' },
    { icon: 'pi pi-cog', label: 'الموقع' }
  ];
}