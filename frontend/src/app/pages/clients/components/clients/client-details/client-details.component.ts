import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../../../shared/components/footer-nav/footer-nav.component';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { CustomerResponse, CustomerService } from '../../../services/customer.service';
import { TransactionResponse, GroupedTransaction, TransactionService } from '../../../services/transactions.service';

// Add interface for total stats
interface TotalStats {
  total1: number;
  total2: number;
  total3: number;
}

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CalendarModule,
    HeaderComponent,
    FooterNavComponent,
    PaymentModalComponent
  ],
})
export class ClientDetailsComponent implements OnInit {
  showAddMenu = false;
  mobileSearchExpanded = false;
  mobileFiltersExpanded = false;
  expandedRows: { [key: string]: boolean } = {};
  showPaymentModal = false;
  searchValue = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  customerId: number = 0;
  loading: boolean = false;
  
  transactions: TransactionResponse[] = [];
  groupedTransactions: GroupedTransaction[] = [];
  isGrouped: boolean = false;
  
  contactDetails: CustomerResponse | null = null;
  
  totalRevenue = 0;
  totalPayments = 0;
  remainingBalance = 0;
  
  // Add totalStats property
  totalStats: TotalStats = {
    total1: 0,
    total2: 0,
    total3: 0
  };
  
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('startDateMobile') startDateMobile!: Calendar;
  @ViewChild('endDateMobile') endDateMobile!: Calendar;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private customerService: CustomerService
  ) {}

  // Add getter to alias transactions as invoices for template compatibility
  get invoices() {
    return this.transactions;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      if (this.customerId) {
        this.loadCustomerDetails();
        this.loadTransactions();
      }
    });
  }

  loadCustomerDetails() {
    this.customerService.getCustomerDetails(this.customerId).subscribe({
      next: (customer: CustomerResponse) => {
        this.contactDetails = customer;
      },
      error: (error: any) => {
        console.error('Error loading customer details:', error);
      }
    });
  }

  loadTransactions() {
    this.loading = true;
    const fromDate = this.startDate ? this.transactionService.formatDateForApi(this.startDate) : undefined;
    const toDate = this.endDate ? this.transactionService.formatDateForApi(this.endDate) : undefined;

    this.transactionService.getCustomerTransactions(this.customerId, fromDate, toDate, '').subscribe({
      next: (response: { success: any; data: { rowsList: any; }; }) => {
        if (response.success && response.data) {
          const { rowsList } = response.data;
          if (this.transactionService.isGroupedResponse(rowsList)) {
            this.isGrouped = true;
            this.groupedTransactions = rowsList;
            this.transactions = this.transactionService.flattenGroupedTransactions(rowsList);
          } else {
            this.isGrouped = false;
            this.transactions = rowsList as TransactionResponse[];
            this.groupedTransactions = [];
          }
          this.calculateTotals();
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading transactions:', error);
        this.loading = false;
      }
    });
  }

  calculateTotals() {
    const totals = this.transactionService.calculateTotals(this.transactions);
    this.totalRevenue = totals.totalOrders;
    this.totalPayments = totals.totalPayments;
    this.remainingBalance = totals.balance;
    
    // Update totalStats based on your business logic
    this.totalStats = {
      total1: this.totalRevenue,
      total2: this.totalPayments,
      total3: this.remainingBalance
    };
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
  }

  goBack() { this.router.navigate(['/clients']); }
  toggleMobileCard(transaction: any) { this.expandedRows[transaction.transactionId] = !this.expandedRows[transaction.transactionId]; }
  showAddOptions() { this.showAddMenu = true; }
  closeAddMenu() { this.showAddMenu = false; }
  addNewOrder() { this.showAddMenu = false; console.log('Add new order'); }
  toggleMobileSearch() { this.mobileSearchExpanded = !this.mobileSearchExpanded; this.mobileFiltersExpanded = false; if (this.mobileSearchExpanded) setTimeout(() => this.searchInput?.nativeElement.focus(), 300); }
  toggleFilters() { this.mobileFiltersExpanded = !this.mobileFiltersExpanded; this.mobileSearchExpanded = false; }
  toggleCalendars() { this.mobileFiltersExpanded = true; this.mobileSearchExpanded = false; }
  openStartDateCalendar() { if (this.startDateMobile) this.startDateMobile.showOverlay(); }
  openEndDateCalendar() { if (this.endDateMobile) this.endDateMobile.showOverlay(); }
  onDateFilterChange() { this.loadTransactions(); }
  onSearch() { this.loadTransactions(); }
  showInvoiceMenu(event: Event, transaction: any) { event.stopPropagation(); console.log('Show menu for transaction:', transaction.transactionId); }
  editInvoice(transaction: any) { console.log('Edit transaction:', transaction.transactionId); }
  deleteInvoice(transaction: any) { if (confirm('هل أنت متأكد من حذف هذه المعاملة؟')) { this.loadTransactions(); alert('تم حذف المعاملة بنجاح'); } }
  exportData() { console.log('Export data'); alert('وظيفة التصدير قيد التطوير'); }
  printPage() { window.print(); }
  openPaymentModal() { this.showPaymentModal = true; }
  handlePaymentSave(paymentData: any) { console.log('Payment saved:', paymentData); this.showPaymentModal = false; this.loadTransactions(); }
  handlePaymentCancel() { this.showPaymentModal = false; }
}