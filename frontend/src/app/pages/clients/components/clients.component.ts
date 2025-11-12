import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../shared/components/footer-nav/footer-nav.component';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { ClientFormComponent } from './client-form/client-form/client-form.component';
import { CustomerService } from '../services/customer.service';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  discount: string;
  creditGiven: string;
  balance: string;
  showMenu?: boolean;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    HeaderComponent,
    FooterNavComponent,
    ToastModule,
    ProgressSpinnerModule,
    ClientFormComponent
  ],
  providers: [MessageService],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ClientsComponent implements OnInit {
  showContactMenu: boolean = false;
  contactMenuType: 'phone' | 'email' | null = null;
  selectedContactValue: string | null = null;
  showDialog: boolean = false;
  selectedClient: any = null;

  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  isEmpty: boolean = false;
  totalClients: number = 0;
  showMobileFabMenu: boolean = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    
    this.customerService.getCustomersList({
      itemsPerPage: 100,
      pageNumber: 0
    }).subscribe({
      next: (response: { RowsList: any[]; TotalLength: number; }) => {
        if (response && response.RowsList) {
          this.clients = response.RowsList.map((c: { customerId: { toString: () => any; }; customerName: any; customerPhoneNumber: any; customerMobileNumber: any; customerEmails: any; customerAddressLine1: any; customerCity: any; customerAllowedExcessAmount: { toString: () => any; }; customerOpeningBalance: { toString: () => any; }; }) => ({
            id: c.customerId.toString(),
            name: c.customerName,
            phone: c.customerPhoneNumber || c.customerMobileNumber || '',
            email: c.customerEmails || '',
            address: `${c.customerAddressLine1 || ''} ${c.customerCity || ''}`.trim(),
            discount: '0%',
            creditGiven: c.customerAllowedExcessAmount?.toString() || '0₪',
            balance: c.customerOpeningBalance?.toString() || '0₪'
          }));
          
          this.filteredClients = [...this.clients];
          this.totalClients = response.TotalLength || this.clients.length;
          this.isEmpty = this.clients.length === 0;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading clients:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تحميل قائمة العملاء'
        });
        this.loading = false;
        this.isEmpty = true;
      }
    });
  }

  onSearchChange(term: string): void {
    if (!term) {
      this.filteredClients = [...this.clients];
    } else {
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(term.toLowerCase()) ||
        client.phone.includes(term) ||
        client.email.toLowerCase().includes(term.toLowerCase()) ||
        client.address.toLowerCase().includes(term.toLowerCase())
      );
    }
    this.isEmpty = this.filteredClients.length === 0 && term.length > 0;
  }

  getDiscountClass(discount: string): string {
    return discount.startsWith('-') ? 'negative' : 'positive';
  }

  openMobileFabMenu(): void {
    this.showMobileFabMenu = true;
  }

  closeMobileFabMenu(): void {
    this.showMobileFabMenu = false;
  }

  viewClientDetails(client: Client): void {
    this.router.navigate(['/customers', client.id]);
  }

  showActionMenu(client: Client): void {
    this.filteredClients.forEach(c => (c as any).showMenu = false);
    (client as any).showMenu = true;
  }

  deleteClient(client: Client): void {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      this.customerService.deleteCustomer(parseInt(client.id)).subscribe({
        next: () => {
          this.clients = this.clients.filter(c => c.id !== client.id);
          this.filteredClients = this.filteredClients.filter(c => c.id !== client.id);
          
          this.messageService.add({
            severity: 'success',
            summary: 'تم الحذف',
            detail: 'تم حذف العميل بنجاح'
          });
        },
        error: (error: any) => {
          console.error('Error deleting client:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في حذف العميل'
          });
        }
      });
    }
  }

  openPhoneMenu(phone: string): void {
    this.contactMenuType = 'phone';
    this.selectedContactValue = phone;
    this.showContactMenu = true;
  }

  openEmailMenu(email: string): void {
    this.contactMenuType = 'email';
    this.selectedContactValue = email;
    this.showContactMenu = true;
  }

  closeContactMenu(): void {
    this.showContactMenu = false;
  }

  callPhone(phone: string): void {
    window.open(`tel:${phone}`, '_self');
  }

  sendSms(phone: string): void {
    window.open(`sms:${phone}`, '_self');
  }

  sendEmail(email: string): void {
    window.open(`mailto:${email}`, '_self');
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'تم النسخ',
        detail: 'تم نسخ النص إلى الحافظة'
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'فشل في النسخ إلى الحافظة'
      });
    });
  }

  addNewClient() {
    this.selectedClient = null;
    this.showDialog = true;
  }

  addNewClientFromMobile() {
    this.selectedClient = null;
    this.showDialog = true;
    this.closeMobileFabMenu();
  }

  editClient(client: any) {
    this.selectedClient = client;
    this.showDialog = true;
  }

  onClientSaved(clientData: any) {
    const customer = {
      customerId: clientData.customerId || undefined,
      customerName: clientData.customerName,
      customerPhoneNumber: clientData.phone,
      customerMobileNumber: clientData.additionalPhone || '',
      customerEmails: clientData.email,
      customerAddressLine1: clientData.address,
      customerStatusId: 1
    };

    this.customerService.saveCustomer(customer).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: clientData.customerId ? 'تم تحديث العميل بنجاح' : 'تم إضافة العميل بنجاح'
        });
        this.loadClients();
      },
      error: (error: any) => {
        console.error('Error saving client:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في حفظ بيانات العميل'
        });
      }
    });
  }

  onDialogClose() {
    this.showDialog = false;
    this.selectedClient = null;
  }

  navigateToClient(client: any): void {
    this.router.navigate(['/customers', client.id]);
  }
}