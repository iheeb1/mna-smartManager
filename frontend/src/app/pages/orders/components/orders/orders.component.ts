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
    FiltersDialogComponent,
    DateRangeDialogComponent
  ],
})
export class OrdersComponent implements OnInit {
  showAddOrderDialog = false;
  editingOrderId: number | null = null;
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
  showAddMenu = false;
  
  totalRecords = 0;
  currentPage = 0;
  itemsPerPage = 50;
  activeFilters: any = {};
  
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('startDateMobile') startDateMobile!: Calendar;
  @ViewChild('endDateMobile') endDateMobile!: Calendar;
  @ViewChild(AddOrderDialogComponent) addOrderDialog!: AddOrderDialogComponent;

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    const params: any = {
      itemsPerPage: this.itemsPerPage,
      pageNumber: this.currentPage,
      groupBy: 'OrderId',
      includeTotalRowsLength: true
    };

    if (this.searchValue?.trim()) {
      params.searchText = this.searchValue.trim();
    }

    if (this.startDate) {
      params.orderDate = {
        fromDate: this.formatDate(this.startDate),
        toDate: this.endDate ? this.formatDate(this.endDate) : this.formatDate(this.startDate)
      };
    }

    Object.assign(params, this.activeFilters);

    this.ordersService.getOrderItemsList(params).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          console.log('Raw API response:', response.data);
          this.orders = this.mapGroupedOrdersFromAPI(response.data.rowsList || []);
          this.totalRecords = response.data.totalLength || 0;
          this.calculateGrandTotals();
        } else {
          console.error('Failed to load orders:', response.message);
          this.orders = [];
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error loading orders:', err);
        alert('حدث خطأ أثناء تحميل الطلبات');
        this.orders = [];
      }
    });
  }

  mapGroupedOrdersFromAPI(groupedData: any[]): Order[] {
    console.log('=== MAPPING GROUPED ORDERS ===');
    console.log('Raw grouped data:', JSON.stringify(groupedData, null, 2));
    
    if (!groupedData || groupedData.length === 0) {
      console.warn('No grouped data to map!');
      return [];
    }
  
    return groupedData.map((group, groupIndex) => {
      console.log(`\n--- Processing group ${groupIndex} ---`);
      console.log('Group structure:', Object.keys(group));
      console.log('Group item (orderId):', group.item);
      
      const orderItems = group.subList || [];
      console.log(`Group has ${orderItems.length} items`);
      
      if (orderItems.length === 0) {
        console.warn('Group has no items, skipping');
        return null;
      }
  
      const firstItem = orderItems[0];
      console.log('First item structure:', Object.keys(firstItem));
      console.log('First item data:', JSON.stringify(firstItem, null, 2));
      
      // Log specific field availability
      console.log('Field availability check:', {
        hasCustomerName: !!firstItem.customerName || !!firstItem.customer?.customerName,
        customerNameValue: firstItem.customerName || firstItem.customer?.customerName,
        hasCarNumber: !!firstItem.carNumber || !!firstItem.car?.carNumber,
        carNumberValue: firstItem.carNumber || firstItem.car?.carNumber,
        hasAddress: !!firstItem.locationAddress || !!firstItem.order?.locationAddress,
        addressValue: firstItem.locationAddress || firstItem.order?.locationAddress,
        hasPhoneNumber: !!firstItem.customerPhoneNumber || !!firstItem.customer?.phoneNumber,
        phoneNumberValue: firstItem.customerPhoneNumber || firstItem.customer?.phoneNumber,
      });
  
      // Helper to safely get nested property
      const safeGet = (obj: any, path: string, defaultVal: any = '') => {
        const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
        console.log(`  ${path} = ${value || defaultVal}`);
        return value || defaultVal;
      };
  
      // Build order object with MULTIPLE fallback paths
      const order: Order = {
        id: group.item || 0,
        date: group.orderDate || safeGet(firstItem, 'orderDate.shortDate'),
        
        // Customer ID - try multiple paths
        customerId: firstItem.customerId || 
                    firstItem.order?.customerId || 
                    firstItem.customer?.customerId || 0,
        
        // Car ID - try multiple paths
        carId: firstItem.carId || 
               firstItem.order?.driverId || 
               firstItem.car?.carId || 0,
        
        // Customer Name - CRITICAL FIELD
        client: firstItem.customerName || 
                firstItem.customer?.customerName || 
                safeGet(firstItem, 'customer.customerName') || '',
        
        // Car Number - CRITICAL FIELD
        vehicle: firstItem.carNumber || 
                 firstItem.car?.carNumber || 
                 safeGet(firstItem, 'car.carNumber') || '',
        
        // Address - CRITICAL FIELD
        address: firstItem.locationAddress || 
                 firstItem.order?.locationAddress || 
                 safeGet(firstItem, 'order.locationAddress') || '',
        
        // Phone Number - CRITICAL FIELD
        phoneNumber: firstItem.customerPhoneNumber || 
                     firstItem.customer?.phoneNumber || 
                     firstItem.customer?.customerPhoneNumber || 
                     firstItem.customer?.customerMobileNumber || '',
        
        // Fixed Type - CRITICAL FIELD - check multiple paths
        fixedType: firstItem.fixedType || 
                   firstItem.order?.fixedType || 
                   (firstItem.order?.fromLocationId ? `Loc-${firstItem.order.fromLocationId}` : '') || '',
        
        // Parking - CRITICAL FIELD - check multiple paths
        parking: firstItem.parking || 
                 firstItem.order?.parking || 
                 firstItem.order?.shippingCertificateId || '',
        
        taxAmount: 0,
        totalBeforeTax: 0,
        totalWithTax: 0,
        items: []
      };
  
      console.log('Built base order:', order);
  
      // Map order items
      order.items = orderItems.map((item: any, itemIndex: number) => {
        console.log(`  Mapping item ${itemIndex}:`, Object.keys(item));
        
        const toNumber = (val: any): number => {
          if (val === null || val === undefined || val === '') return 0;
          const num = typeof val === 'string' ? parseFloat(val) : Number(val);
          return isNaN(num) ? 0 : num;
        };
        
        const mappedItem = {
          orderItemId: item.orderItemId || 0,
          orderId: group.item || 0,
          productId: item.orderTypeId || item.productId || 0,
          productCode: safeGet(item, 'product.productCode'),
          productName: safeGet(item, 'product.productName') || safeGet(item, 'orderType.productName'),
          description: safeGet(item, 'product.productName') || safeGet(item, 'orderType.productName'),
          duration: item.duration || '',
          quantity: toNumber(item.orderUnitsNumber || item.quantity),
          price: toNumber(item.orderPrice || item.price),
          totalBeforeTax: toNumber(item.orderTotalPriceWithOutVat || item.totalBeforeTax),
          taxAmount: toNumber(item.orderTotalPriceVat || item.totalTax || item.taxAmount),
          totalWithTax: toNumber(item.orderTotalPriceWithVat || item.totalWithTax),
          beforeTax: toNumber(item.orderTotalPriceWithOutVat || item.totalBeforeTax),
          tax: toNumber(item.orderTotalPriceVat || item.totalTax || item.taxAmount),
          total: toNumber(item.orderTotalPriceWithVat || item.totalWithTax)
        };
        
        console.log(`  Mapped item ${itemIndex}:`, mappedItem);
        return mappedItem;
      });
  
      // Calculate order totals
      order.totalBeforeTax = order.items.reduce((sum, item) => sum + (item.totalBeforeTax || 0), 0);
      order.taxAmount = order.items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
      order.totalWithTax = order.items.reduce((sum, item) => sum + (item.totalWithTax || 0), 0);
  
      console.log('Final order with totals:', {
        id: order.id,
        totalBeforeTax: order.totalBeforeTax,
        taxAmount: order.taxAmount,
        totalWithTax: order.totalWithTax,
        itemCount: order.items.length
      });
  
      return order;
    }).filter(order => order !== null) as Order[];
  }
  

  calculateGrandTotals() {
    this.grandTotalBeforeTax = this.orders.reduce((sum, order) => sum + (order.totalBeforeTax || 0), 0);
    this.grandTotalTax = this.orders.reduce((sum, order) => sum + (order.taxAmount || 0), 0);
    this.grandTotalWithTax = this.orders.reduce((sum, order) => sum + (order.totalWithTax || 0), 0);
  }

  formatCurrency(value: number | string | undefined): string {
    if (value === undefined || value === null || value === '') return '0.00₪';
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    // Check if conversion resulted in valid number
    if (isNaN(numValue)) return '0.00₪';
    return `${numValue.toFixed(2)}₪`;
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
    this.currentPage = 0;
    this.loadOrders();
  }

  onDateFilterChange() {
    this.currentPage = 0;
    this.loadOrders();
  }

  openAddOrderDialog() {
    this.editingOrderId = null;
    this.showAddOrderDialog = true;
  }

  editOrder(order: Order) {
    console.log('Editing order:', order);
    this.editingOrderId = order.id;
    
    // Load full order details with items
    this.loading = true;
    this.ordersService.getOrderDetails(order.id, true).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          // Open dialog and populate with data
          this.showAddOrderDialog = true;
          
          // Wait for dialog to open then populate
          setTimeout(() => {
            if (this.addOrderDialog) {
              this.addOrderDialog.populateOrderData(response.data, order);
            }
          }, 100);
        } else {
          alert('فشل في تحميل بيانات الطلب');
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error loading order details:', err);
        alert('حدث خطأ أثناء تحميل بيانات الطلب');
      }
    });
  }

  onDialogHide() {
    this.showAddOrderDialog = false;
    this.editingOrderId = null;
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
      this.loading = true;
      this.ordersService.deleteOrder(orderId).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.success) {
            alert('تم حذف الطلب بنجاح');
            this.loadOrders();
          } else {
            alert('خطأ: ' + response.message);
          }
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Error deleting order:', err);
          alert('حدث خطأ أثناء حذف الطلب');
        }
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
    this.showFiltersDialog = true;
  }

  toggleCalendars() {
    this.mobileFiltersExpanded = true;
    this.mobileSearchExpanded = false;
    this.showDateRangeDialog = true;
  }

  openStartDateCalendar() {
    this.showDateRangeDialog = true;
  }
  
  openEndDateCalendar() {
    this.showDateRangeDialog = true;
  }

  onApplyFilters(filters: FilterOptions) {
    console.log('Applied filters:', filters);
    this.activeFilters = filters;
    this.currentPage = 0;
    this.loadOrders();
  }

  onApplyDateRange(dateRange: DateRange) {
    this.startDate = dateRange.startDate;
    this.endDate = dateRange.endDate;
    this.currentPage = 0;
    this.loadOrders();
  }

  showAddOptions() {
    this.showAddMenu = true;
  }

  closeAddMenu() {
    this.showAddMenu = false;
  }

  addImmediateOrder() {
    this.showAddMenu = false;
    this.openAddOrderDialog();
  }

  addRegularOrder() {
    this.showAddMenu = false;
    this.openAddOrderDialog();
  }

  onPageChange(event: any) {
    this.currentPage = event.page || 0;
    this.itemsPerPage = event.rows || 50;
    this.loadOrders();
  }
}