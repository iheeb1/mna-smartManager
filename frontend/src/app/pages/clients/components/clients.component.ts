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
  providers: [MessageService], // MessageService is provided here
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

  clients: Client[] = [
    {
      id: '1',
      name: 'מחמוד אחמד אלסייד',
      phone: '0-123456789',
      email: 'Example@gmail.com',
      address: 'הגיזה, 31 כפר חכים',
      discount: '2.49%',
      creditGiven: '1.36₪',
      balance: '1.36₪'
    },
    {
      id: '2',
      name: 'חברת בניית הפירמידה בע"מ',
      phone: '0-123456789',
      email: 'info@ash-projects.co.il',
      address: 'חלב, הקבלה 45 בהבלד',
      discount: '-20.45%',
      creditGiven: '2.56₪',
      balance: '2.56₪'
    },
    {
      id: '3',
      name: 'חלב, דוראן 12, בית-2',
      phone: '0-123456789',
      email: 'contact@greenbuild.co.il',
      address: 'באר שבע, הרווחה הם ח.מ',
      discount: '1.45%',
      creditGiven: '1.36₪',
      balance: '1.36₪'
    },
    {
      id: '4',
      name: 'נד, כבאש, בית-6',
      phone: '0-123456789',
      email: 'Example@gmail.com',
      address: 'חלב, הקבלה 30 בהבלד',
      discount: '-5.49%',
      creditGiven: '2.56₪',
      balance: '2.56₪'
    },
    {
      id: '5',
      name: 'הירוק ובניה מוסד',
      phone: '0-123456789',
      email: 'info@ash-projects.co.il',
      address: 'חלב, דוראן 22, בית-7',
      discount: '57%',
      creditGiven: '1.36₪',
      balance: '1.36₪'
    },
    {
      id: '6',
      name: 'מחמוד אחמד אלסייד',
      phone: '0-123456789',
      email: 'contact@greenbuild.co.il',
      address: 'הגיזה, 31 כפר חכים',
      discount: '-20.45%',
      creditGiven: '1.36₪',
      balance: '1.36₪'
    },
    {
      id: '7',
      name: 'חלב, הקבלה 45 בהבלד',
      phone: '0-123456789',
      email: 'Example@gmail.com',
      address: 'חלב, הקבלה 45 בהבלד',
      discount: '1.45%',
      creditGiven: '2.56₪',
      balance: '2.56₪'
    },
    {
      id: '8',
      name: 'חברת בניית הפירמידה בע"מ',
      phone: '0-123456789',
      email: 'info@ash-projects.co.il',
      address: 'חלב, דוראן 12, בית-2',
      discount: '-5.49%',
      creditGiven: '1.36₪',
      balance: '1.36₪'
    } 
  ];

  filteredClients: Client[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  isEmpty: boolean = false;
  totalClients: number = 0;
  showMobileFabMenu: boolean = false;

  // Use constructor injection (correct approach)
  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    
    setTimeout(() => {
      this.filteredClients = [...this.clients];
      this.totalClients = this.clients.length;
      this.isEmpty = this.clients.length === 0;
      this.loading = false;
    }, 500);
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
    if (discount.startsWith('-')) {
      return 'negative';
    }
    return 'positive';
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
    // Ferme tous les autres menus
    this.filteredClients.forEach(c => (c as any).showMenu = false);
  
    // Ouvre le menu du client cliqué
    (client as any).showMenu = true;
  }

  deleteClient(client: Client): void {
    this.clients = this.clients.filter(c => c.id !== client.id);
    this.filteredClients = this.filteredClients.filter(c => c.id !== client.id);
  
    this.messageService.add({
      severity: 'success',
      summary: 'Supprimé',
      detail: 'Client supprimé avec succès'
    });
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
    // Handle save logic here
    console.log('Client saved:', clientData);
    this.loadClients(); // Refresh the list
  }
  
  onDialogClose() {
    this.showDialog = false;
    this.selectedClient = null;
  }
}