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
import { ChecksService } from '../../services/checks.service';
import { ClearedCheck } from '../../services/reports.services';

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
  expandedCheckId: string | null = null;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private checksService: ChecksService
  ) {}

  ngOnInit() {
    this.initializeMenuItems();
    this.loadChecks();
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

  async loadChecks() {
    this.isLoading = true;
    
    try {
      // Get default date range (last year to today)
      const dateRange = this.checksService.getDefaultDateRange();
      
      // Load cleared checks from API
      this.checks = await this.checksService.getClearedChecks({
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        paymentItemCheckStatusIds: '2', // 2 = Cleared status
        itemsPerPage: 1000,
        pageNumber: 1
      });
      
      this.filteredChecks = [...this.checks];
      
      if (this.checks.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'لا توجد بيانات',
          detail: 'لا توجد شيكات محصلة في الفترة المحددة'
        });
      }
    } catch (error) {
      console.error('Error loading checks:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'حدث خطأ أثناء تحميل الشيكات'
      });
    } finally {
      this.isLoading = false;
    }
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredChecks = [...this.checks];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredChecks = this.checks.filter(check =>
      check.customerName.toLowerCase().includes(query) ||
      check.checkNumber.toLowerCase().includes(query) ||
      check.accountNumber.toLowerCase().includes(query) ||
      check.amount.includes(query) ||
      check.bank.toLowerCase().includes(query) ||
      (check.notes && check.notes.toLowerCase().includes(query))
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
    // Navigate to edit page or open dialog
    this.messageService.add({
      severity: 'info',
      summary: 'تعديل',
      detail: 'فتح نموذج التعديل...'
    });
    // TODO: Implement edit functionality
    // this.router.navigate(['/checks/edit', check.id]);
  }

  async deleteCheck(check: ClearedCheck) {
    if (!confirm('هل أنت متأكد من حذف هذا الشيك؟')) {
      return;
    }

    try {
      const success = await this.checksService.deleteCheck(check.id);
      
      if (success) {
        // Remove from local arrays
        this.checks = this.checks.filter(c => c.id !== check.id);
        this.filteredChecks = this.filteredChecks.filter(c => c.id !== check.id);
        
        this.messageService.add({
          severity: 'success',
          summary: 'تم الحذف',
          detail: 'تم حذف الشيك بنجاح'
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل حذف الشيك'
        });
      }
    } catch (error) {
      console.error('Error deleting check:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'حدث خطأ أثناء حذف الشيك'
      });
    }
  }

  exportData() {
    try {
      // Convert data to CSV
      const headers = ['التاريخ', 'اسم العميل', 'البنك', 'رقم الحساب', 'رقم الشيك', 'تاريخ الدفع', 'المبلغ', 'ملاحظات'];
      const rows = this.filteredChecks.map(check => [
        check.date,
        check.customerName,
        check.bank,
        check.accountNumber,
        check.checkNumber,
        check.paymentDate,
        check.amount,
        check.notes || ''
      ]);

      let csvContent = '\uFEFF'; // UTF-8 BOM for Arabic support
      csvContent += headers.join(',') + '\n';
      csvContent += rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `cleared_checks_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.messageService.add({
        severity: 'success',
        summary: 'تصدير',
        detail: 'تم تصدير البيانات بنجاح'
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'فشل تصدير البيانات'
      });
    }
  }

  printTable() {
    window.print();
  }

  addNewCheck() {
    console.log('Add new check');
    // Navigate to add page or open dialog
    this.messageService.add({
      severity: 'info',
      summary: 'إضافة',
      detail: 'فتح نموذج إضافة شيك جديد...'
    });
    // TODO: Implement add functionality
    // this.router.navigate(['/checks/add']);
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
  
  toggleCard(checkId: string) {
    this.expandedCheckId = this.expandedCheckId === checkId ? null : checkId;
  }
}