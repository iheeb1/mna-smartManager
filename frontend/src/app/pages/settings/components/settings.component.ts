import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../shared/components/footer-nav/footer-nav.component';
import { ProductsTableComponent, ProductTableConfig } from './products-table/products-table.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    ToastModule,
    MenuModule,
    FooterNavComponent,
    HeaderComponent,
    ProductsTableComponent
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('rowMenu') rowMenu!: Menu;

  // Mobile tab state
  activeMobileTab: string = 'products'; // Changed default to 'products'
  isMobile: boolean = false;

  roles = [
    { 
      id: 1, 
      name: 'مدير المشاريع',
      permissions: {
        createEditProjects: true,
        monitorPerformance: true,
        budgetAccess: true,
        resourcePlanning: true,
        assignEmployees: true,
        trackEmployeePerformance: true,
        generateReports: true,
        qualityReports: true,
        securityReports: true
      }
    },
    { 
      id: 2, 
      name: 'مدير تنفيذي',
      permissions: {
        createEditProjects: true,
        monitorPerformance: true,
        budgetAccess: false,
        resourcePlanning: true,
        assignEmployees: false,
        trackEmployeePerformance: true,
        generateReports: true,
        qualityReports: false,
        securityReports: false
      }
    },
    { 
      id: 3, 
      name: 'مدير فريق',
      permissions: {
        createEditProjects: false,
        monitorPerformance: true,
        budgetAccess: false,
        resourcePlanning: false,
        assignEmployees: true,
        trackEmployeePerformance: true,
        generateReports: false,
        qualityReports: false,
        securityReports: false
      }
    },
    { 
      id: 4, 
      name: 'مهندس',
      permissions: {
        createEditProjects: false,
        monitorPerformance: false,
        budgetAccess: false,
        resourcePlanning: false,
        assignEmployees: false,
        trackEmployeePerformance: false,
        generateReports: false,
        qualityReports: true,
        securityReports: true
      }
    },
    { 
      id: 5, 
      name: 'عمال الميدان',
      permissions: {
        createEditProjects: false,
        monitorPerformance: false,
        budgetAccess: false,
        resourcePlanning: false,
        assignEmployees: false,
        trackEmployeePerformance: false,
        generateReports: false,
        qualityReports: false,
        securityReports: false
      }
    },
    { 
      id: 6, 
      name: 'قسم المالية',
      permissions: {
        createEditProjects: false,
        monitorPerformance: false,
        budgetAccess: true,
        resourcePlanning: false,
        assignEmployees: false,
        trackEmployeePerformance: false,
        generateReports: true,
        qualityReports: false,
        securityReports: false
      }
    }
  ];
  
  activeRoleIndex = 0;
  currentRolePermissions = { ...this.roles[0].permissions };

  // Products Tab Configuration
  productsConfig: ProductTableConfig = {
    columns: [
      { field: 'name', header: 'اسم المنتج', type: 'text', flex: '2' },
      { field: 'number', header: 'رمز العنصر', type: 'text', flex: '1' },
      { field: 'amount', header: 'السعر', type: 'text', flex: '1' },
      { field: 'status', header: 'الحالة', type: 'text', flex: '0 0 120px' },
      { field: 'statusLabel', header: 'رقم العنوان الافتراضي', type: 'text', flex: '0 0 180px' },
      { field: 'actions', header: '', type: 'actions', flex: '0 0 100px' }
    ],
    data: [
      { id: 1, name: 'مضخات مؤود', number: '0123456789', amount: '50,000₪', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 3, name: 'بناء يوتك المحدودة', number: '0123456789', amount: '50,000₪', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 4, name: 'ن.ط مقاولو البناء', number: '0123456789', amount: '50,000₪', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 5, name: 'استثمارات عقارات بارزة', number: '0123456789', amount: '50,000₪', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
    ],
    searchPlaceholder: 'بحث حر عن منتج',
    addButtonText: 'إضافة منتج'
  };

  // Banks Tab Configuration
  banksConfig: ProductTableConfig = {
    columns: [
      { field: 'name', header: 'اسم البنك', type: 'text', flex: '2' },
      { field: 'number', header: 'رمز العنصر', type: 'text', flex: '1' },
      { field: 'status', header: 'الحالة', type: 'text', flex: '0 0 120px' },
      { field: 'statusLabel', header: 'رقم العنوان الافتراضي', type: 'status', flex: '0 0 180px' },
      { field: 'actions', header: '', type: 'actions', flex: '0 0 100px' }
    ],
    data: [
      { id: 1, name: 'بنك لئومي', number: '10', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 2, name: 'بنك هبوعليم', number: '12', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 3, name: 'بنك ديسكونت', number: '11', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 4, name: 'بنك القدس', number: '54', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
    ],
    searchPlaceholder: 'بحث حر عن بنك',
    addButtonText: 'إضافة بنك جديد'
  };

  // Check Status Tab Configuration
  checkStatusConfig: ProductTableConfig = {
    columns: [
      { field: 'name', header: 'اسم الحالة', type: 'text', flex: '3' },
      { field: 'number', header: 'رمز العنصر', type: 'text', flex: '1' },
      { field: 'status', header: 'الحالة', type: 'status', flex: '0 0 120px' },
      { field: 'statusLabel', header: 'رقم العنوان الافتراضي', type: 'status', flex: '0 0 180px' },
      { field: 'actions', header: '', type: 'actions', flex: '0 0 100px' }
    ],
    data: [
      { id: 1, name: 'لم يصرف بعد', number: '001', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 2, name: 'مصروف', number: '002', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 3, name: 'مرفوض', number: '003', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 4, name: 'ملغى', number: '004', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
    ],
    searchPlaceholder: 'بحث حر عن حالة',
    addButtonText: 'إضافة حالة جديدة'
  };

  // Address Management Tab Configuration
  addressConfig: ProductTableConfig = {
    columns: [
      { field: 'name', header: 'اسم العنوان', type: 'text', flex: '3' },
      { field: 'number', header: 'رمز العنصر', type: 'text', flex: '1' },
      { field: 'status', header: 'الحالة', type: 'status', flex: '0 0 120px' },
      { field: 'statusLabel', header: 'رقم العنوان الافتراضي', type: 'status', flex: '0 0 180px' },
      { field: 'actions', header: '', type: 'actions', flex: '0 0 100px' }
    ],
    data: [
      { id: 1, name: 'رعنانا', number: '001', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 2, name: 'رعنانا', number: '002', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 3, name: 'رعنانا', number: '003', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 4, name: 'رعنانا', number: '004', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
    ],
    searchPlaceholder: 'بحث حر عن عنوان',
    addButtonText: 'إضافة عنوان جديد'
  };

  // Payment Types Tab Configuration (default active tab)
  paymentTypesConfig: ProductTableConfig = {
    columns: [
      { field: 'name', header: 'اسم نوع الدفع', type: 'text', flex: '3' },
      { field: 'number', header: 'رمز العنصر', type: 'text', flex: '1' },
      { field: 'status', header: 'الحالة', type: 'status', flex: '0 0 120px' },
      { field: 'statusLabel', header: 'رقم العنوان الافتراضي', type: 'status', flex: '0 0 180px' },
      { field: 'actions', header: '', type: 'actions', flex: '0 0 100px' }
    ],
    data: [
      { id: 1, name: 'نقدي', number: '001', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 2, name: 'مقاصة', number: '002', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 3, name: 'شيك مرتجع', number: '003', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
      { id: 4, name: 'دين قديم', number: '004', status: 'نشط', statusLabel: 'غير نشط', isActive: false },
    ],
    searchPlaceholder: 'بحث حر عن نوع دفع',
    addButtonText: 'إضافة نوع دفع جديد'
  };

  tabs = ['المنتجات', 'البنوك', 'حالة الشيك', 'إدارة العناوين', 'أنواع الدفع'];
  activeTabIndex = 0; 

  currentConfig: ProductTableConfig = this.productsConfig;

  // User profile data
  userProfile = {
    firstName: 'يعقوب',
    lastName: 'شجب',
    idNumber: '123456789',
    address: 'كفر قاسم، الاتحاد ',
    phone: '0541234567',
    email: 'example2000@gmail.com'
  };

  // Settings toggles
  generalSettings = {
    percentage: 17,
    showLogo: true
  };

  uploadSettings = {
    allowMultipleAttachments: true,
    allowMultipleProjects: false
  };

  projectSettings = {
    editProjectValues: true,
    sortProjectsByDate: false
  };

  budgetSettings = {
    editFrequencyDates: false,
    allowQualityActivity: false,
    allowBudgetActivity: false,
    planResources: false 
  };

  employeeSettings = {
    allowTimesheetEdit: true,
    sortEmployeesByDate: true,
    allowBasicSalaryActivity: false,
    allowBusinessEventActivity: true
  };

  constructor() {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.updateConfig();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  setActiveMobileTab(tab: string) {
    this.activeMobileTab = tab;
    if (this.isMobile) {
      // Scroll to top with a slight delay to ensure DOM updates
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  }

  updateConfig() {
    switch(this.activeTabIndex) {
      case 0:
        this.currentConfig = this.productsConfig;
        break;
      case 1:
        this.currentConfig = this.banksConfig;
        break;
      case 2:
        this.currentConfig = this.checkStatusConfig;
        break;
      case 3:
        this.currentConfig = this.addressConfig;
        break;
      case 4:
        this.currentConfig = this.paymentTypesConfig;
        break;
    }
  }

  // Table event handlers
  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.updateConfig();
  }

  onProductEdit(row: any) {
    console.log('Edit row:', row);
    // Implement edit logic
  }

  onProductDelete(row: any) {
    console.log('Delete row:', row);
    // Implement delete logic
  }

  onProductAdd() {
    console.log('Add new item for tab:', this.activeTabIndex);
    // Implement add logic based on active tab
  }

  updateProfile() {
    console.log('Update profile:', this.userProfile);
  }

  onRoleChange(index: number) {
    this.activeRoleIndex = index;
    this.currentRolePermissions = { ...this.roles[index].permissions };
    console.log('Role changed to:', this.roles[index].name);
    
  }

  onAddRole() {
    console.log('إضافة دور وظيفي جديد');
  }
}