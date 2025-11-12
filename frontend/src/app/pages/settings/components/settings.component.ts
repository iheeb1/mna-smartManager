import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../shared/components/footer-nav/footer-nav.component';
import { ProductsTableComponent, ProductTableConfig, ProductTableRow } from './products-table/products-table.component';
import { SettingsService } from '../services/settings.service';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

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
  activeMobileTab: string = 'products';
  isMobile: boolean = false;
  isLoading: boolean = false;

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
    data: [],
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
    data: [],
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
    data: [],
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
    data: [],
    searchPlaceholder: 'بحث حر عن عنوان',
    addButtonText: 'إضافة عنوان جديد'
  };

  // Payment Types Tab Configuration
  paymentTypesConfig: ProductTableConfig = {
    columns: [
      { field: 'name', header: 'اسم نوع الدفع', type: 'text', flex: '3' },
      { field: 'number', header: 'رمز العنصر', type: 'text', flex: '1' },
      { field: 'status', header: 'الحالة', type: 'status', flex: '0 0 120px' },
      { field: 'statusLabel', header: 'رقم العنوان الافتراضي', type: 'status', flex: '0 0 180px' },
      { field: 'actions', header: '', type: 'actions', flex: '0 0 100px' }
    ],
    data: [],
    searchPlaceholder: 'بحث حر عن نوع دفع',
    addButtonText: 'إضافة نوع دفع جديد'
  };

  tabs = ['المنتجات', 'البنوك', 'حالة الشيك', 'إدارة العناوين', 'أنواع الدفع'];
  activeTabIndex = 0; 

  currentConfig: ProductTableConfig = this.productsConfig;

  // User profile data - will be populated from AuthService
  userProfile = {
    firstName: '',
    lastName: '',
    idNumber: '',
    address: '',
    phone: '',
    email: ''
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

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadInitialData();
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
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  }

  loadUserProfile() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userProfile = {
        firstName: currentUser.fullName?.split(' ')[0] || '',
        lastName: currentUser.fullName?.split(' ')[1] || '',
        idNumber: currentUser.userId?.toString() || '',
        address: currentUser.addressLine1 || '',
        phone: currentUser.phoneNumber || currentUser.mobileNumber || '',
        email: currentUser.userName || ''
      };
    }
  }

  loadInitialData() {
    // Load data for the active tab
    this.loadTabData(this.activeTabIndex);
  }

  loadTabData(tabIndex: number) {
    this.isLoading = true;
    
    switch(tabIndex) {
      case 0:
        this.loadProducts();
        break;
      case 1:
        this.loadBanks();
        break;
      case 2:
        this.loadCheckStatuses();
        break;
      case 3:
        this.loadAddresses();
        break;
      case 4:
        this.loadPaymentTypes();
        break;
    }
  }

  loadProducts() {
    this.settingsService.getProducts()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (products: ProductTableRow[]) => {
          this.productsConfig.data = products;
          this.updateConfig();
        },
        error: (error: any) => {
          console.error('Error loading products:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحميل المنتجات'
          });
        }
      });
  }

  loadBanks() {
    this.settingsService.getBanks()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (banks: ProductTableRow[]) => {
          this.banksConfig.data = banks;
          this.updateConfig();
        },
        error: (error: any) => {
          console.error('Error loading banks:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحميل البنوك'
          });
        }
      });
  }

  loadCheckStatuses() {
    this.settingsService.getCheckStatuses()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (statuses: ProductTableRow[]) => {
          this.checkStatusConfig.data = statuses;
          this.updateConfig();
        },
        error: (error: any) => {
          console.error('Error loading check statuses:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحميل حالات الشيكات'
          });
        }
      });
  }

  loadAddresses() {
    this.settingsService.getAddresses()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (addresses: ProductTableRow[]) => {
          this.addressConfig.data = addresses;
          this.updateConfig();
        },
        error: (error: any) => {
          console.error('Error loading addresses:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحميل العناوين'
          });
        }
      });
  }

  loadPaymentTypes() {
    this.settingsService.getPaymentTypes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (types: ProductTableRow[]) => {
          this.paymentTypesConfig.data = types;
          this.updateConfig();
        },
        error: (error: any) => {
          console.error('Error loading payment types:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحميل أنواع الدفع'
          });
        }
      });
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

  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.loadTabData(index);
  }

  onProductEdit(row: any) {
    console.log('Edit row:', row);
    // This is called when edit button is clicked
  }

  onProductSave(row: any) {
    // This is called when save button is clicked after editing
    this.isLoading = true;
    
    if (this.activeTabIndex === 0) {
      // Products
      this.settingsService.saveProduct(row)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(
          (response: any) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'نجح',
                detail: 'تم حفظ المنتج بنجاح'
              });
              this.loadProducts();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: response.errorMessage || 'فشل في حفظ المنتج'
              });
            }
          },
          (error: any) => {
            console.error('Error saving product:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في حفظ المنتج'
            });
          }
        );
    } else {
      // Lookups (Banks, Check Statuses, Addresses, Payment Types)
      const lookupTypeId = this.settingsService.getLookupTypeByTabIndex(this.activeTabIndex);
      this.settingsService.saveLookup(row, lookupTypeId)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(
          (response: any) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'نجح',
                detail: 'تم الحفظ بنجاح'
              });
              this.loadTabData(this.activeTabIndex);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: response.errorMessage || 'فشل في الحفظ'
              });
            }
          },
          (error: any) => {
            console.error('Error saving lookup:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في الحفظ'
            });
          }
        );
    }
  }

  onProductDelete(row: any) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      return;
    }

    this.isLoading = true;

    if (this.activeTabIndex === 0) {
      // Products
      this.settingsService.deleteProduct(row.id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'نجح',
                detail: 'تم الحذف بنجاح'
              });
              this.loadProducts();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: response.errorMessage || 'فشل في الحذف'
              });
            }
          },
          error: (error: any) => {
            console.error('Error deleting product:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في الحذف'
            });
          }
        });
    } else {
      // Lookups
      this.settingsService.deleteLookup(row.id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'نجح',
                detail: 'تم الحذف بنجاح'
              });
              this.loadTabData(this.activeTabIndex);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: response.errorMessage || 'فشل في الحذف'
              });
            }
          },
          error: (error: any) => {
            console.error('Error deleting lookup:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في الحذف'
            });
          }
        });
    }
  }

  onProductAdd() {
    console.log('Add new item for tab:', this.activeTabIndex);
    // This would typically open a modal/form for adding new items
    // The actual save would call onProductSave with the new data
  }

  updateProfile() {
    console.log('Update profile:', this.userProfile);
    // You can add API call here to update user profile if needed
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