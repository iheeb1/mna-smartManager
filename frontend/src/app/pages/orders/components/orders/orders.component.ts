// src/app/features/orders/pages/orders/orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../../shared/components/footer-nav/footer-nav.component';
import { AddOrderDialogComponent } from './add-order-dialog/add-order-dialog.component';
import { Order } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';

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
    FooterNavComponent,
  ],
})
export class OrdersComponent implements OnInit {
  showAddOrderDialog = false;
  searchValue = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  orders: Order[] = [];
  expandedRows: { [key: string]: boolean } = {};
  loading = false;

  // Totals
  grandTotalBeforeTax = 0;
  grandTotalTax = 0;
  grandTotalWithTax = 0;

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    const params: any = {
      itemsPerPage: 50,
      pageNumber: 0,
      groupBy: 'OrderId',
    };

    if (this.searchValue) {
      params.searchText = this.searchValue;
    }

    if (this.startDate) {
      params.fromDate = this.formatDate(this.startDate);
    }

    if (this.endDate) {
      params.toDate = this.formatDate(this.endDate);
    }

    this.ordersService.getOrderItemsList(params).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data?.rowsList) {
          this.orders = this.mapOrderItems(response.data.rowsList);
          this.calculateGrandTotals();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading orders:', err);
      },
    });
  }

  mapOrderItems(data: any[]): Order[] {
    return data.map((group: any) => {
      const firstItem = group.subList[0];
      const items = group.subList.map((item: any) => ({
        description: item.product?.productName || '',
        duration: item.duration || '-',
        quantity: item.quantity || 0,
        beforeTax: item.totalBeforeTax || 0,
        tax: item.taxAmount || 0,
        total: item.totalWithTax || 0,
      }));

      const totalBeforeTax = group.subList.reduce((sum: number, item: any) => sum + (item.totalBeforeTax || 0), 0);
      const totalTax = group.subList.reduce((sum: number, item: any) => sum + (item.taxAmount || 0), 0);
      const totalWithTax = group.subList.reduce((sum: number, item: any) => sum + (item.totalWithTax || 0), 0);

      return {
        id: firstItem.orderId || group.item,
        date: firstItem.orderDate?.shortDate || '',
        client: firstItem.customer?.customerName || '',
        vehicle: firstItem.order?.car?.carNumber || '',
        address: firstItem.order?.addressLine1 || '',
        phoneNumber: firstItem.customer?.phoneNumber || '',
        fixedType: firstItem.order?.fixedType || '',
        parking: firstItem.order?.parking || '',
        taxAmount: totalTax,
        totalBeforeTax: totalBeforeTax,
        totalWithTax: totalWithTax,
        items,
      };
    });
  }

  calculateGrandTotals() {
    this.grandTotalBeforeTax = this.orders.reduce((sum, order) => sum + (order.totalBeforeTax || 0), 0);
    this.grandTotalTax = this.orders.reduce((sum, order) => sum + (order.taxAmount || 0), 0);
    this.grandTotalWithTax = this.orders.reduce((sum, order) => sum + (order.totalWithTax || 0), 0);
  }

  formatCurrency(value: number): string {
    if (!value) return '0₪';
    return `${value.toFixed(2)}₪`;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onSearch() {
    this.loadOrders();
  }

  onDateFilterChange() {
    this.loadOrders();
  }

  openAddOrderDialog() {
    this.showAddOrderDialog = true;
  }

  onDialogHide() {
    this.showAddOrderDialog = false;
  }

  onOrderSaved(orderData: any) {
    this.loadOrders();
  }

  onRowExpand(event: any) {
    console.log('Row expanded:', event.data);
  }

  onRowCollapse(event: any) {
    console.log('Row collapsed:', event.data);
  }

  deleteOrder(orderId: number) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      this.ordersService.deleteOrderItem(orderId).subscribe({
        next: (response) => {
          if (response.success) {
            alert('تم حذف الطلب بنجاح');
            this.loadOrders();
          }
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          alert('حدث خطأ أثناء حذف الطلب');
        },
      });
    }
  }
}