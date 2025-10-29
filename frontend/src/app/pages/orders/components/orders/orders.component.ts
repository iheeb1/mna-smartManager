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
import { AddOrderDialogComponent } from './add-order-dialog/add-order-dialog.component';
import { Order, OrderItem, GroupedOrderItems } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';
import { CustomersService } from '../../services/customers.service';
import { CarsService } from '../../services/cars.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  mobileSearchExpanded = false;

  grandTotalBeforeTax = 0;
  grandTotalTax = 0;
  grandTotalWithTax = 0;
  mobileFiltersExpanded: boolean = false;
  
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('startDateMobile') startDateMobile!: Calendar;
  @ViewChild('endDateMobile') endDateMobile!: Calendar;
  
  private customersCache: Map<number, any> = new Map();
  private carsCache: Map<number, any> = new Map();

  constructor(
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private carsService: CarsService
  ) {}

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
        console.log('API Response:', response);
        
        const rowsList = response.result_data?.rowsList || response.data?.rowsList;
        
        if (rowsList && rowsList.length > 0) {
          const basicOrders = this.mapOrderItems(rowsList);
          
          this.enrichOrdersWithCustomerData(basicOrders);
        } else {
          console.log('No orders found');
          this.orders = [];
          this.calculateGrandTotals();
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading orders:', err);
        alert('حدث خطأ أثناء تحميل الطلبات');
      },
    });
  }

  mapOrderItems(data: GroupedOrderItems[]): Order[] {
    console.log('Mapping order items, raw data:', data);
    
    return data.map((group: GroupedOrderItems) => {
      const firstItem = group.subList[0];
      
      console.log('First item in group:', firstItem);
      console.log('Order data:', firstItem.order);
      
      const items: OrderItem[] = group.subList.map((item: any) => {
        const beforeTax = parseFloat(item.orderPrice?.totalItemPriceWithOutVat) || 0;
        const tax = parseFloat(item.orderPrice?.totalItemPriceVat) || 0;
        const total = parseFloat(item.orderPrice?.totalItemPriceWithVat) || 0;
        
        return {
          orderItemId: item.orderItemId,
          orderId: item.order?.orderId,
          productId: item.orderType?.productId || null,
          productCode: item.orderType?.productCode || '',
          productName: item.orderType?.productName || item.product?.productName || 'N/A',
          description: item.orderType?.productName || item.product?.productName || 'N/A',
          duration: '-', 
          quantity: parseFloat(item.orderUnitsNumber) || 0,
          price: parseFloat(item.orderPrice?.itemPrice) || 0,
          totalBeforeTax: beforeTax,
          taxAmount: tax,
          totalWithTax: total,
          beforeTax: beforeTax,
          tax: tax,
          total: total,
        };
      });

      console.log('Mapped items:', items);

      const totalBeforeTax = items.reduce((sum, item) => sum + item.totalBeforeTax, 0);
      const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
      const totalWithTax = items.reduce((sum, item) => sum + item.totalWithTax, 0);

      const customerId = firstItem.order?.customerId || null;
      const carId = firstItem.order?.carId || null;

      console.log('Customer ID:', customerId, 'Car ID:', carId);

      const order = {
        id: typeof group.item === 'number' ? group.item : (firstItem.order?.orderId || 0),
        date: firstItem.orderDate?.shortDate || group.orderDate || '',
        customerId: customerId,
        carId: carId,
        client: '-',
        vehicle: '-',
        address: '-', 
        phoneNumber: '-',
        fixedType: firstItem.order?.fixedType || '-',
        parking: firstItem.order?.parking || '-',
        taxAmount: totalTax,
        totalBeforeTax: totalBeforeTax,
        totalWithTax: totalWithTax,
        items,
      };

      console.log('Mapped order:', order);
      
      return order;
    });
  }

  enrichOrdersWithCustomerData(orders: Order[]) {
    console.log('Enriching orders:', orders);
    
    // Get unique customer IDs that we don't have in cache
    const customerIds = [...new Set(
      orders
        .map(order => order.customerId)
        .filter(id => id && !this.customersCache.has(id))
    )] as number[];

    // Get unique car IDs that we don't have in cache
    const carIds = [...new Set(
      orders
        .map(order => order.carId)
        .filter(id => id && !this.carsCache.has(id))
    )] as number[];

    console.log('Need to fetch customers:', customerIds);
    console.log('Need to fetch cars:', carIds);

    // If everything is cached, just enrich and return
    if (customerIds.length === 0 && carIds.length === 0) {
      console.log('All data cached, enriching from cache');
      this.orders = orders.map(order => this.enrichOrderFromCache(order));
      this.calculateGrandTotals();
      this.loading = false;
      return;
    }

    // Prepare all requests
    const requests: Observable<any>[] = [];

    customerIds.forEach(customerId => {
      requests.push(
        this.customersService.getCustomerDetails(customerId).pipe(
          map(response => ({
            type: 'customer',
            id: customerId,
            success: response.success,
            data: response.data
          })),
          catchError(error => {
            console.error(`Error fetching customer ${customerId}:`, error);
            return of({ type: 'customer', id: customerId, success: false, data: null });
          })
        )
      );
    });

    carIds.forEach(carId => {
      requests.push(
        this.carsService.getCarDetails(carId).pipe(
          map(response => ({
            type: 'car',
            id: carId,
            success: response.success,
            data: response.data
          })),
          catchError(error => {
            console.error(`Error fetching car ${carId}:`, error);
            return of({ type: 'car', id: carId, success: false, data: null });
          })
        )
      );
    });

    forkJoin(requests).subscribe({
      next: (responses) => {
        console.log('Received responses:', responses);
        
        responses.forEach((response: any) => {
          if (response.success && response.data) {
            if (response.type === 'customer') {
              console.log('Caching customer:', response.id, response.data);
              this.customersCache.set(response.id, response.data);
            } else if (response.type === 'car') {
              console.log('Caching car:', response.id, response.data);
              this.carsCache.set(response.id, response.data);
            }
          }
        });

        console.log('Customers cache:', this.customersCache);
        console.log('Cars cache:', this.carsCache);

        this.orders = orders.map(order => this.enrichOrderFromCache(order));
        console.log('Final enriched orders:', this.orders);
        this.calculateGrandTotals();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.orders = orders;
        this.calculateGrandTotals();
        this.loading = false;
      }
    });
  }

  enrichOrderFromCache(order: Order): Order {
    console.log('Enriching order:', order.id, 'customerId:', order.customerId, 'carId:', order.carId);
    
    const enrichedOrder = { ...order };

    if (order.customerId && this.customersCache.has(order.customerId)) {
      const customerData = this.customersCache.get(order.customerId);
      console.log('Found customer data:', customerData);
      
      if (customerData) {
        enrichedOrder.client = customerData.customerName || '-';
        enrichedOrder.phoneNumber = customerData.customerPhoneNumber || customerData.customerMobileNumber || '-';
        enrichedOrder.address = customerData.customerAddressLine1 || '-';
      }
    } else {
      console.log('No customer data found for:', order.customerId);
    }

    if (order.carId && this.carsCache.has(order.carId)) {
      const carData = this.carsCache.get(order.carId);
      console.log('Found car data:', carData);
      
      if (carData) {
        enrichedOrder.vehicle = carData.carNumber || carData.carPlateNumber || '-';
      }
    } else {
      console.log('No car data found for:', order.carId);
    }

    console.log('Enriched order result:', enrichedOrder);
    return enrichedOrder;
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
    this.customersCache.clear();
    this.carsCache.clear();
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
          } else {
            alert('فشل حذف الطلب: ' + (response.message || 'خطأ غير معروف'));
          }
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          alert('حدث خطأ أثناء حذف الطلب');
        },
      });
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
  }

  toggleCalendars() {
    this.mobileFiltersExpanded = true;
    this.mobileSearchExpanded = false;
  }

  openStartDateCalendar() {
    setTimeout(() => {
      this.startDateMobile?.showOverlay();
    }, 100);
  }

  openEndDateCalendar() {
    setTimeout(() => {
      this.endDateMobile?.showOverlay();
    }, 100);
  }
}