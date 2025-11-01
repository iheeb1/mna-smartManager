import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../../shared/components/footer-nav/footer-nav.component';
import { FilterOptions, FiltersDialogComponent } from '../../../../shared/components/filters-dialog/filters-dialog.component';
import { DateRange, DateRangeDialogComponent } from '../../../../shared/components/date-range-dialog/date-range-dialog.component';
import { AddOrderDialogComponent } from './add-order-dialog/add-order-dialog.component';
import { Order, OrderItem } from '../../models/order.model';

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
    FiltersDialogComponent,
    DateRangeDialogComponent
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
  mobileSearchExpanded = false;

  grandTotalBeforeTax = 0;
  grandTotalTax = 0;
  grandTotalWithTax = 0;
  mobileFiltersExpanded: boolean = false;

  showFiltersDialog = false;
  showDateRangeDialog = false;
  
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('startDateMobile') startDateMobile!: Calendar;
  @ViewChild('endDateMobile') endDateMobile!: Calendar;

  constructor() {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    // Simulate API delay
    setTimeout(() => {
      // Generate fake orders
      this.orders = this.generateFakeOrders();
      this.calculateGrandTotals();
      this.loading = false;
    }, 500);
  }

  generateFakeOrders(): Order[] {
    const customers = [
      { name: 'أحمد محمود', phone: '0599-123-456', address: 'رام الله' },
      { name: 'فاطمة حسن', phone: '0598-234-567', address: 'نابلس' },
      { name: 'محمد علي', phone: '0597-345-678', address: 'الخليل' },
      { name: 'سارة خالد', phone: '0596-456-789', address: 'بيت لحم' },
      { name: 'يوسف إبراهيم', phone: '0595-567-890', address: 'جنين' },
    ];

    const vehicles = [
      '12-345-67', '23-456-78', '34-567-89', '45-678-90', '56-789-01'
    ];

    const services = [
      { name: 'تغيير زيت المحرك', price: 150 },
      { name: 'فحص الفرامل', price: 80 },
      { name: 'تبديل الإطارات', price: 200 },
      { name: 'فحص شامل', price: 120 },
      { name: 'تنظيف المحرك', price: 90 },
      { name: 'إصلاح التكييف', price: 250 },
      { name: 'تبديل البطارية', price: 180 },
      { name: 'صيانة دورية', price: 160 },
    ];

    const fixedTypes = ['عادي', 'سريع'];
    const parkingTypes = ['موقف أ', 'موقف ب'];

    const fakeOrders: Order[] = [];
    const today = new Date();

    for (let i = 0; i < 5; i++) {
      const customer = customers[i];
      const vehicle = vehicles[i];
      
      // Generate random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date(today);
      orderDate.setDate(orderDate.getDate() - daysAgo);
      
      // Generate 2-4 items per order
      const itemCount = Math.floor(Math.random() * 3) + 2;
      const items: OrderItem[] = [];
      
      for (let j = 0; j < itemCount; j++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = service.price;
        const beforeTax = price * quantity;
        const tax = beforeTax * 0.16; // 16% VAT
        const total = beforeTax + tax;

        items.push({
          orderItemId: i * 10 + j,
          orderId: i + 1,
          productId: j + 1,
          productCode: `PRD-${1000 + j}`,
          productName: service.name,
          description: service.name,
          duration: `${Math.floor(Math.random() * 3) + 1} ساعة`,
          quantity: quantity,
          price: price,
          totalBeforeTax: beforeTax,
          taxAmount: tax,
          totalWithTax: total,
          beforeTax: beforeTax,
          tax: tax,
          total: total,
        });
      }

      const totalBeforeTax = items.reduce((sum, item) => sum + item.totalBeforeTax, 0);
      const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
      const totalWithTax = items.reduce((sum, item) => sum + item.totalWithTax, 0);

      fakeOrders.push({
        id: i + 1,
        date: this.formatDate(orderDate),
        customerId: i + 1,
        carId: i + 1,
        client: customer.name,
        vehicle: vehicle,
        address: customer.address,
        phoneNumber: customer.phone,
        fixedType: fixedTypes[Math.floor(Math.random() * fixedTypes.length)],
        parking: parkingTypes[Math.floor(Math.random() * parkingTypes.length)],
        taxAmount: totalTax,
        totalBeforeTax: totalBeforeTax,
        totalWithTax: totalWithTax,
        items: items,
      });
    }

    return fakeOrders;
  }

  calculateGrandTotals() {
    this.grandTotalBeforeTax = this.orders.reduce((sum, order) => sum + (order.totalBeforeTax || 0), 0);
    this.grandTotalTax = this.orders.reduce((sum, order) => sum + (order.taxAmount || 0), 0);
    this.grandTotalWithTax = this.orders.reduce((sum, order) => sum + (order.totalWithTax || 0), 0);
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) return '0₪';
    return `${value.toFixed(2)}₪`;
  }

  formatDate(date: Date): string {
    if (!date) return '';
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
      this.orders = this.orders.filter(order => order.id !== orderId);
      this.calculateGrandTotals();
      alert('تم حذف الطلب بنجاح');
    }
  }

  exportOrders() {
    console.log('Export orders');
    alert('وظيفة التصدير قيد التطوير');
  }

  printOrders() {
    window.print();
  }

  toggleMobileCard(order: Order) {
    this.expandedRows[order.id] = !this.expandedRows[order.id];
  }

  showOrderMenu(event: Event, order: Order) {
    event.stopPropagation();
    console.log('Show menu for order:', order.id);
  }

  toggleMobileSearch() {
    this.mobileSearchExpanded = !this.mobileSearchExpanded;
    this.mobileFiltersExpanded = false;
    
    if (this.mobileSearchExpanded) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 300);
    }
  }

  toggleFilters() {
    this.mobileFiltersExpanded = !this.mobileFiltersExpanded;
    this.mobileSearchExpanded = false;
    this.showFiltersDialog = true;

  }

  toggleCalendars() {
    this.mobileFiltersExpanded = true;
    this.mobileSearchExpanded = false;
    this.showDateRangeDialog = true;
  }

  openStartDateCalendar() {
    // Open the date range dialog instead of trying to show hidden calendars
    this.showDateRangeDialog = true;
  }
  
  openEndDateCalendar() {
    // Open the date range dialog instead of trying to show hidden calendars
    this.showDateRangeDialog = true;
  }

  onApplyFilters(filters: FilterOptions) {
    console.log('Applied filters:', filters);
  }

  onApplyDateRange(dateRange: DateRange) {
    this.startDate = dateRange.startDate;
    this.endDate = dateRange.endDate;
    this.loadOrders();
  }
}