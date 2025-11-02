import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../../../shared/components/footer-nav/footer-nav.component';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';

interface InvoiceItem {
  id: string;
  description: string;
  type: string;
  address: string;
  vehicle: string;
  discount: string;
  amount: string;
  totalVat: string;
  balance: string;
  date: string;
}

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterNavComponent,
    ButtonModule,
    PaymentModalComponent
  ],
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  clientId: string = '';
  
  // Modal visibility
  showPaymentModal: boolean = false;
  
  // Static client info
  clientName: string = 'חברת בניית הפירמידה בע"מ';
  
  // Statistics
  totalRevenue: string = '6,505.20₪';
  totalPayments: string = '9,000₪';
  remainingBalance: string = '2,494.80₪';

  // Contact details
  contactDetails = {
    clientName: 'כתובת',
    address: 'הצבעוני 31, כפר',
    phone: '050-1234567',
    fax: '050-1234567',
    mobile: '050-1234567',
    email: 'info@ash-projects.co.il'
  };

  // Invoice data
  invoices: InvoiceItem[] = [
    {
      id: '1',
      description: 'לילם ואפסף',
      type: 'אנכון שית',
      address: 'פורום ואפסף דולרם',
      vehicle: 'פריטים 31',
      discount: '31$',
      amount: '25,000₪',
      totalVat: '25,000₪',
      balance: '25,000₪',
      date: '31/8/2024'
    },
    {
      id: '2',
      description: 'לילם ואפסף',
      type: 'אנכון שית',
      address: 'פורום ואפסף דולרם',
      vehicle: 'פריטים 31',
      discount: '31$',
      amount: '25,000₪',
      totalVat: '25,000₪',
      balance: '25,000₪',
      date: '31/8/2024'
    },
    {
      id: '3',
      description: 'לילם ואפסף',
      type: 'אנכון שית',
      address: 'פורום ואפסף דולרם',
      vehicle: 'פריטים 31',
      discount: '31$',
      amount: '25,000₪',
      totalVat: '25,000₪',
      balance: '25,000₪',
      date: '31/8/2024'
    },
    {
      id: '4',
      description: 'לילם ואפסף',
      type: 'אנכון שית',
      address: 'פורום ואפסף דולרם',
      vehicle: 'פריטים 31',
      discount: '31$',
      amount: '25,000₪',
      totalVat: '25,000₪',
      balance: '25,000₪',
      date: '31/8/2024'
    },
    {
      id: '5',
      description: 'לילם ואפסף',
      type: 'אנכון שית',
      address: 'פורום ואפסף דולרם',
      vehicle: 'פריטים 31',
      discount: '31$',
      amount: '25,000₪',
      totalVat: '25,000₪',
      balance: '25,000₪',
      date: '31/8/2024'
    },
    {
      id: '6',
      description: 'לילם ואפסף',
      type: 'אנכון שית',
      address: 'פורום ואפסף דולרם',
      vehicle: 'פריטים 31',
      discount: '31$',
      amount: '25,000₪',
      totalVat: '25,000₪',
      balance: '25,000₪',
      date: '31/8/2024'
    },
    {
      id: '7',
      description: 'לילם ואפסף',
      type: 'אנכון שית',
      address: 'פורום ואפסף דולרם',
      vehicle: 'פריטים 31',
      discount: '31$',
      amount: '25,000₪',
      totalVat: '25,000₪',
      balance: '25,000₪',
      date: '31/8/2024'
    },
    {
      id: '8',
      description: 'לילם ואפסף',
      type: 'אנכון שית',
      address: 'פורום ואפסף דולרם',
      vehicle: 'פריטים 31',
      discount: '31$',
      amount: '25,000₪',
      totalVat: '25,000₪',
      balance: '25,000₪',
      date: '31/8/2024'
    }
  ];

  totalStats = {
    total1: '6,505₪',
    total2: '945₪',
    total3: '5,560₪'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  exportData(): void {
    console.log('Export data');
  }

  printPage(): void {
    window.print();
  }

  editInvoice(invoice: InvoiceItem): void {
    console.log('Edit invoice:', invoice);
  }

  deleteInvoice(invoice: InvoiceItem): void {
    console.log('Delete invoice:', invoice);
  }
  
  openPaymentModal(): void {
    this.showPaymentModal = true;
  }
  
  handlePaymentSave(paymentData: any): void {
    console.log('Payment saved:', paymentData);
    this.showPaymentModal = false;
  }
  
  handlePaymentCancel(): void {
    console.log('Payment cancelled');
    this.showPaymentModal = false;
  }
}