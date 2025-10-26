import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../../shared/components/footer-nav/footer-nav.component';

interface ClearedCheck {
  id: string;
  date: string;
  customerName: string;
  bank: string;
  accountNumber: string;
  checkNumber: string;
  paymentDate: string;
  notes: string;
  amount: string;
}

@Component({
  selector: 'app-checks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputSwitchModule,
    MenuModule,
    ToastModule,
    ProgressSpinnerModule,
    InputTextModule,
    HeaderComponent,
    FooterNavComponent
  ],
  providers: [MessageService],
  templateUrl: './checks.component.html',
  styleUrls: ['./checks.component.scss']
})
export class ChecksComponent implements OnInit {
  @ViewChild('checkMenu') checkMenu!: Menu;
  
  checks: ClearedCheck[] = [];
  filteredChecks: ClearedCheck[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  selectedCheck: ClearedCheck | null = null;
  checkMenuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadChecks();
    this.initializeMenuItems();
  }

  initializeMenuItems() {
    this.checkMenuItems = [
      {
        label: 'تعديل',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedCheck) {
            this.editCheck(this.selectedCheck);
          }
        }
      },
      {
        label: 'حذف',
        icon: 'pi pi-trash',
        styleClass: 'delete-item',
        command: () => {
          if (this.selectedCheck) {
            this.deleteCheck(this.selectedCheck);
          }
        }
      }
    ];
  }

  loadChecks() {
    this.isLoading = true;
    
    // Simulate API call with complete data for all columns
    setTimeout(() => {
      this.checks = [
        {
          id: '1',
          date: '18/08/24',
          customerName: 'أحمد محمد علي',
          bank: 'بنك لؤمي',
          accountNumber: '123456789',
          checkNumber: '1001234',
          paymentDate: '25/08/24',
          notes: 'دفعة أولى للمشروع',
          amount: '50000'
        },
        {
          id: '2',
          date: '19/08/24',
          customerName: 'فاطمة علي حسن',
          bank: 'بنك ديسكونت',
          accountNumber: '987654321',
          checkNumber: '1002345',
          paymentDate: '26/08/24',
          notes: 'سداد كامل',
          amount: '75000'
        },
        {
          id: '3',
          date: '20/08/24',
          customerName: 'خالد حسن إبراهيم',
          bank: 'بنك هبوعليم',
          accountNumber: '555123456',
          checkNumber: '1003456',
          paymentDate: '27/08/24',
          notes: 'دفعة شهرية',
          amount: '30000'
        },
        {
          id: '4',
          date: '21/08/24',
          customerName: 'سارة إبراهيم محمود',
          bank: 'بنك لؤمي',
          accountNumber: '999888777',
          checkNumber: '1004567',
          paymentDate: '28/08/24',
          notes: 'تسوية حساب',
          amount: '45000'
        },
        {
          id: '5',
          date: '22/08/24',
          customerName: 'محمود عمر خليل',
          bank: 'بنك ميزراحي',
          accountNumber: '111222333',
          checkNumber: '1005678',
          paymentDate: '29/08/24',
          notes: 'دفعة نهائية',
          amount: '60000'
        },
        {
          id: '6',
          date: '23/08/24',
          customerName: 'ليلى يوسف أحمد',
          bank: 'بنك ديسكونت',
          accountNumber: '444555666',
          checkNumber: '1006789',
          paymentDate: '30/08/24',
          notes: 'عربون شراء',
          amount: '25000'
        },
        {
          id: '7',
          date: '24/08/24',
          customerName: 'طارق سعيد عبدالله',
          bank: 'بنك لؤمي',
          accountNumber: '777888999',
          checkNumber: '1007890',
          paymentDate: '31/08/24',
          notes: 'دفعة مقدمة',
          amount: '90000'
        },
        {
          id: '8',
          date: '25/08/24',
          customerName: 'نور الدين صالح',
          bank: 'بنك هبوعليم',
          accountNumber: '333444555',
          checkNumber: '1008901',
          paymentDate: '01/09/24',
          notes: 'سداد قرض',
          amount: '40000'
        }
      ];
      
      this.filteredChecks = [...this.checks];
      this.isLoading = false;
    }, 1000);
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredChecks = [...this.checks];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredChecks = this.checks.filter(check =>
      check.customerName.toLowerCase().includes(query) ||
      check.checkNumber.includes(query) ||
      check.accountNumber.includes(query) ||
      check.amount.includes(query) ||
      check.bank.toLowerCase().includes(query) ||
      check.notes.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredChecks = [...this.checks];
  }

  getTotalAmount(): string {
    const total = this.filteredChecks.reduce((sum, check) => {
      const amount = parseFloat(check.amount.replace(/,/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    return total.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  showCheckMenu(event: Event, check: ClearedCheck) {
    this.selectedCheck = check;
    this.checkMenu.toggle(event);
  }

  editCheck(check: ClearedCheck) {
    console.log('Edit check:', check);
    this.messageService.add({
      severity: 'info',
      summary: 'تعديل',
      detail: 'فتح نموذج التعديل...'
    });
  }

  deleteCheck(check: ClearedCheck) {
    if (confirm('هل أنت متأكد من حذف هذا الشيك؟')) {
      this.checks = this.checks.filter(c => c.id !== check.id);
      this.filteredChecks = this.filteredChecks.filter(c => c.id !== check.id);
      
      this.messageService.add({
        severity: 'success',
        summary: 'تم الحذف',
        detail: 'تم حذف الشيك بنجاح'
      });
    }
  }

  exportData() {
    console.log('Exporting data...');
    this.messageService.add({
      severity: 'info',
      summary: 'تصدير',
      detail: 'جاري تصدير البيانات...'
    });
  }

  printTable() {
    window.print();
  }

  addNewCheck() {
    console.log('Add new check');
    this.messageService.add({
      severity: 'info',
      summary: 'إضافة',
      detail: 'فتح نموذج إضافة شيك جديد...'
    });
  }

  viewCheckDetails(check: ClearedCheck, event: Event) {
    event.preventDefault();
    console.log('View details:', check);
    this.messageService.add({
      severity: 'info',
      summary: 'التفاصيل',
      detail: `عرض تفاصيل الشيك: ${check.customerName}`
    });
  }

  goBack() {
    this.router.navigate(['/reports']);
  }
}