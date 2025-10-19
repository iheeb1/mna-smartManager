import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../../shared/components/footer-nav/footer-nav.component';

// Your components
import { AddOrderDialogComponent } from './add-order-dialog/add-order-dialog.component';

interface OrderItem {
  description: string;
  duration: string;
  quantity: number;
  beforeTax: string;
  tax: string;
  total: string;
}

interface Order {
  id: number;
  date: string;
  client: string;
  vehicle: string;
  address: string;
  phoneNumber: string;
  fixedType: string;
  tax: string;
  preTax: string;
  total: string;
  items?: OrderItem[];
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    TooltipModule,
    AddOrderDialogComponent,
    HeaderComponent,
    FooterNavComponent
  ]
})
export class OrdersComponent implements OnInit {
  // Dialog visibility state
  showAddOrderDialog = false;

  // Search and filter
  searchValue = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Table data
  orders: Order[] = [];
  expandedRows: { [key: string]: boolean } = {};

  ngOnInit() {
    // Initialize with sample data
    this.orders = [
      {
        id: 1,
        date: '15/01/2024',
        client: 'أحمد محمد',
        vehicle: '12-345-67',
        address: 'شارع الملك فهد، الرياض',
        phoneNumber: '0501234567',
        fixedType: 'نعم',
        tax: '150₪',
        preTax: '1,000₪',
        total: '1,150₪',
        items: [
          {
            description: 'خدمة صيانة شاملة',
            duration: '2 ساعات',
            quantity: 1,
            beforeTax: '800₪',
            tax: '120₪',
            total: '920₪'
          },
          {
            description: 'قطع غيار',
            duration: '-',
            quantity: 3,
            beforeTax: '200₪',
            tax: '30₪',
            total: '230₪'
          }
        ]
      },
      {
        id: 2,
        date: '16/01/2024',
        client: 'فاطمة علي',
        vehicle: '98-765-43',
        address: 'شارع العليا، جدة',
        phoneNumber: '0559876543',
        fixedType: 'لا',
        tax: '225₪',
        preTax: '1,500₪',
        total: '1,725₪',
        items: [
          {
            description: 'فحص دوري',
            duration: '1 ساعة',
            quantity: 1,
            beforeTax: '500₪',
            tax: '75₪',
            total: '575₪'
          },
          {
            description: 'تغيير زيت',
            duration: '30 دقيقة',
            quantity: 1,
            beforeTax: '1,000₪',
            tax: '150₪',
            total: '1,150₪'
          }
        ]
      },
      {
        id: 3,
        date: '17/01/2024',
        client: 'خالد عبدالله',
        vehicle: '55-888-99',
        address: 'شارع التحلية، الدمام',
        phoneNumber: '0505551234',
        fixedType: 'نعم',
        tax: '180₪',
        preTax: '1,200₪',
        total: '1,380₪',
        items: [
          {
            description: 'إصلاح المحرك',
            duration: '4 ساعات',
            quantity: 1,
            beforeTax: '1,200₪',
            tax: '180₪',
            total: '1,380₪'
          }
        ]
      }
    ];
  }

  // Dialog methods
  openAddOrderDialog() {
    this.showAddOrderDialog = true;
    console.log('Opening dialog, showAddOrderDialog:', this.showAddOrderDialog);
  }

  onDialogHide() {
    this.showAddOrderDialog = false;
    console.log('Dialog hidden, showAddOrderDialog:', this.showAddOrderDialog);
  }

  // Table expansion methods
  onRowExpand(event: any) {
    console.log('Row expanded:', event.data);
  }

  onRowCollapse(event: any) {
    console.log('Row collapsed:', event.data);
  }
}