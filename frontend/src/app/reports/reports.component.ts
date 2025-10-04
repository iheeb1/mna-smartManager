import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { HeaderComponent } from '../components/header/header.component';
import { FooterNavComponent } from '../components/footer-nav/footer-nav.component';

interface Transaction {
  description: string;
  date: string;
  amount: number;
  accountNumber: string;
  checkNumber?: string;
  collectionDate?: string;
  status: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    TabViewModule,
    HeaderComponent,
    FooterNavComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  departments: any[] = [];
  timeRanges: any[] = [];
  selectedDepartment: any;
  selectedTimeRange: any;

  systemEvaluation: any[] = [
    { date: '18/08/24', time: '09:00', createdBy: 'مدير النظام' },
    { date: '18/08/24', time: '09:00', createdBy: 'مدير النظام' },
    { date: '18/08/24', time: '09:00', createdBy: 'مدير النظام' },
    { date: '18/08/24', time: '09:00', createdBy: 'مدير النظام' },
    { date: '18/08/24', time: '09:00', createdBy: 'مدير النظام' },
    { date: '18/08/24', time: '09:00', createdBy: 'مدير النظام' },
    { date: '18/08/24', time: '09:00', createdBy: 'مدير النظام' },
    { date: '18/08/24', time: '09:00', createdBy: 'مدير النظام' }
  ];

  alertsAndClaims: any[] = [
    { date: '18/08/24', description: 'لدفع عميل المركز' },
    { date: '18/08/24', description: 'شركة كوليت أ.ش' },
    { date: '18/08/24', description: 'فحص الاتصال بالبطاقة' },
    { date: '18/08/24', description: 'ن.ج مقاولو بناء' },
    { date: '18/08/24', description: 'مدفوعات وبائعو هليل' },
    { date: '18/08/24', description: 'فحص الاتصال بالبطاقة' },
    { date: '18/08/24', description: 'ن.ج مقاولو بناء' },
    { date: '18/08/24', description: 'مدفوعات وبائعو هليل' }
  ];

  clearedChecks: any[] = [
    { date: '18/08/24', collectionDate: '18/08/24', accountNumber: '0123456789', amount: '50,000', description: 'وصف التحصيل', checkNumber: '0123456789' },
    { date: '18/08/24', collectionDate: '18/08/24', accountNumber: '0123456789', amount: '50,000', description: 'شركة كوليت أ.ش', checkNumber: '0123456789' },
    { date: '18/08/24', collectionDate: '18/08/24', accountNumber: '0123456789', amount: '50,000', description: 'فحص الاتصال بالبطاقة', checkNumber: '0123456789' },
    { date: '18/08/24', collectionDate: '18/08/24', accountNumber: '0123456789', amount: '50,000', description: 'ن.ج مقاولو بناء', checkNumber: '0123456789' },
    { date: '18/08/24', collectionDate: '18/08/24', accountNumber: '0123456789', amount: '50,000', description: 'مدفوعات وبائعو هليل', checkNumber: '0123456789' },
    { date: '18/08/24', collectionDate: '18/08/24', accountNumber: '0123456789', amount: '50,000', description: 'فحص الاتصال بالبطاقة', checkNumber: '0123456789' },
    { date: '18/08/24', collectionDate: '18/08/24', accountNumber: '0123456789', amount: '50,000', description: 'ن.ج مقاولو بناء', checkNumber: '0123456789' },
    { date: '18/08/24', collectionDate: '18/08/24', accountNumber: '0123456789', amount: '50,000', description: 'مدفوعات وبائعو هليل', checkNumber: '0123456789' }
  ];

  ngOnInit() {
    this.departments = [
      { label: 'جميع الأقسام', value: 'all' },
      { label: 'القسم 1', value: 'dept1' },
      { label: 'القسم 2', value: 'dept2' }
    ];

    this.timeRanges = [
      { label: 'جميع الأوقات', value: 'all' },
      { label: 'اليوم', value: 'today' },
      { label: 'هذا الأسبوع', value: 'week' },
      { label: 'هذا الشهر', value: 'month' }
    ];
  }
}