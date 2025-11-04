import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../../../shared/components/footer-nav/footer-nav.component';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';

interface Invoice {
  id: number;
  description: string;
  date: string;
  type: string;
  address: string;
  vehicle: string;
  discount: string;
  amount: string;
  totalVat: string;
  balance: string;
  items?: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  beforeTax: string;
  tax: string;
  total: string;
}

interface ContactDetails {
  clientName: string;
  address: string;
  phone: string;
  fax: string;
  mobile: string;
  email: string;
}

interface TotalStats {
  total1: string;
  total2: string;
  total3: string;
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
  // Mobile UI states
  showAddMenu = false;
  mobileSearchExpanded = false;
  mobileFiltersExpanded = false;
  expandedRows: { [key: string]: boolean } = {};
  
  // Modal states
  showPaymentModal = false;
  
  // Search and filters
  searchValue = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  // Data
  invoices: Invoice[] = [];
  contactDetails: ContactDetails = {
    clientName: 'أحمد محمود',
    address: 'رام الله - شارع الإرسال',
    phone: '02-2345678',
    fax: '02-2345679',
    mobile: '0599-123456',
    email: 'ahmed@example.com'
  };
  
  totalStats: TotalStats = {
    total1: '0₪',
    total2: '0₪',
    total3: '0₪'
  };
  
  // Summary stats
  totalRevenue = '0₪';
  totalPayments = '0₪';
  remainingBalance = '0₪';
  
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('startDateMobile') startDateMobile!: Calendar;
  @ViewChild('endDateMobile') endDateMobile!: Calendar;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadInvoices();
    this.calculateTotals();
  }

  loadInvoices() {
    // Generate fake invoices data
    this.invoices = this.generateFakeInvoices();
    this.calculateTotals();
  }

  generateFakeInvoices(): Invoice[] {
    const types = ['طلب', 'فاتورة', 'دفعة'];
    const addresses = ['رام الله', 'نابلس', 'الخليل', 'بيت لحم'];
    const vehicles = ['12-345-67', '23-456-78', '34-567-89', '45-678-90'];
    const descriptions = ['خدمة صيانة', 'تغيير زيت', 'فحص شامل', 'إصلاح'];
    
    const fakeInvoices: Invoice[] = [];
    const today = new Date();

    for (let i = 0; i < 8; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const invoiceDate = new Date(today);
      invoiceDate.setDate(invoiceDate.getDate() - daysAgo);
      
      const amount = Math.floor(Math.random() * 5000) + 500;
      const discount = Math.floor(Math.random() * 200);
      const beforeTax = amount - discount;
      const tax = beforeTax * 0.16;
      const totalVat = beforeTax + tax;
      const balance = Math.floor(Math.random() * 1000);

      // Generate items for expansion
      const items: InvoiceItem[] = [];
      const itemCount = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < itemCount; j++) {
        const itemAmount = Math.floor(amount / itemCount);
        const itemTax = itemAmount * 0.16;
        items.push({
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          quantity: Math.floor(Math.random() * 5) + 1,
          beforeTax: `${itemAmount.toFixed(2)}₪`,
          tax: `${itemTax.toFixed(2)}₪`,
          total: `${(itemAmount + itemTax).toFixed(2)}₪`
        });
      }

      fakeInvoices.push({
        id: i + 1,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        date: this.formatDate(invoiceDate),
        type: types[Math.floor(Math.random() * types.length)],
        address: addresses[Math.floor(Math.random() * addresses.length)],
        vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
        discount: `${discount.toFixed(2)}₪`,
        amount: `${amount.toFixed(2)}₪`,
        totalVat: `${totalVat.toFixed(2)}₪`,
        balance: `${balance.toFixed(2)}₪`,
        items: items
      });
    }

    return fakeInvoices;
  }

  calculateTotals() {
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    let revenue = 0;
    let payments = 0;
    let balance = 0;

    this.invoices.forEach(invoice => {
      // Parse currency strings to numbers
      const amount = parseFloat(invoice.amount.replace('₪', '')) || 0;
      const vat = parseFloat(invoice.totalVat.replace('₪', '')) || 0;
      const bal = parseFloat(invoice.balance.replace('₪', '')) || 0;

      total1 += amount;
      total2 += vat;
      total3 += bal;
      
      if (invoice.type === 'فاتورة' || invoice.type === 'طلب') {
        revenue += vat;
      } else if (invoice.type === 'دفعة') {
        payments += amount;
      }
      
      balance += bal;
    });

    this.totalStats = {
      total1: `${total1.toFixed(2)}₪`,
      total2: `${total2.toFixed(2)}₪`,
      total3: `${total3.toFixed(2)}₪`
    };

    this.totalRevenue = `${revenue.toFixed(2)}₪`;
    this.totalPayments = `${payments.toFixed(2)}₪`;
    this.remainingBalance = `${balance.toFixed(2)}₪`;
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  // Navigation
  goBack() {
    this.router.navigate(['/clients']);
  }

  // Mobile UI toggles
  toggleMobileCard(invoice: Invoice) {
    this.expandedRows[invoice.id] = !this.expandedRows[invoice.id];
  }

  showAddOptions() {
    this.showAddMenu = true;
  }

  closeAddMenu() {
    this.showAddMenu = false;
  }

  addNewOrder() {
    this.showAddMenu = false;
    // Navigate to add order or open dialog
    console.log('Add new order');
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
    if (this.startDateMobile) {
      this.startDateMobile.showOverlay();
    }
  }
  
  openEndDateCalendar() {
    if (this.endDateMobile) {
      this.endDateMobile.showOverlay();
    }
  }

  onDateFilterChange() {
    this.loadInvoices();
  }

  onSearch() {
    this.loadInvoices();
  }

  // Invoice actions
  showInvoiceMenu(event: Event, invoice: Invoice) {
    event.stopPropagation();
    console.log('Show menu for invoice:', invoice.id);
    // Implement menu logic here (edit, delete, view details, etc.)
  }

  editInvoice(invoice: Invoice) {
    console.log('Edit invoice:', invoice.id);
    // Navigate to edit or open dialog
  }

  deleteInvoice(invoice: Invoice) {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      this.invoices = this.invoices.filter(inv => inv.id !== invoice.id);
      this.calculateTotals();
      alert('تم حذف الفاتورة بنجاح');
    }
  }

  // Export and print
  exportData() {
    console.log('Export data');
    alert('وظيفة التصدير قيد التطوير');
  }

  printPage() {
    window.print();
  }

  // Payment modal
  openPaymentModal() {
    this.showPaymentModal = true;
  }

  handlePaymentSave(paymentData: any) {
    console.log('Payment saved:', paymentData);
    this.showPaymentModal = false;
    // Reload invoices to reflect new payment
    this.loadInvoices();
  }

  handlePaymentCancel() {
    this.showPaymentModal = false;
  }
}