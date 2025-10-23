import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HeaderComponent } from '../../../shared/components/header/header.component'; 
import { FooterNavComponent } from '../../../shared/components/footer-nav/footer-nav.component'; 
import { Customer, CustomerService } from '../../../core/services/customers.service';

interface UserData {
  userId: number;
  userStatus: number;
  userType: number;
  fullName: string;
  userName: string;
  phoneNumber: string;
  mobileNumber: string;
  faxNumber: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string;
  state: string | null;
  zip: string | null;
  country: string | null;
  profileImage: string | null;
  resetGuId: string | null;
  createdBy: number;
  modifiedBy: number;
  createdDate: string;
  modifiedDate: string;
}

interface MenuItem {
  svgPath: string;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    TableModule, 
    TagModule, 
    HeaderComponent, 
    FooterNavComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  totalRecords = 0;
  userName = 'محمد';
  greetingMessage = 'صباح الخير';

  menuItems: MenuItem[] = [
    { 
      svgPath: 'assets/icons/bag_icon.svg',
      label: 'الإدارة' 
    },
    { 
      svgPath: 'assets/icons/users_icon.svg',
      label: 'المستخدمون' 
    },
    { 
      svgPath: 'assets/icons/print_icon.svg',
      label: 'الطباعة' 
    },
    { 
      svgPath: 'assets/icons/settings_icon_v2.svg',
      label: 'الموقع' 
    }
  ];

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadUserData();
    this.loadCustomers();
  }

  loadUserData() {
    try {
      const userDataStr = localStorage.getItem('smart_user_data');
      if (userDataStr) {
        const userData: UserData = JSON.parse(userDataStr);
        this.userName = userData.fullName || 'محمد';
        this.setGreeting();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greetingMessage = 'صباح الخير';
    } else if (hour < 18) {
      this.greetingMessage = 'مساء الخير';
    } else {
      this.greetingMessage = 'مساء الخير';
    }
  }

  loadCustomers() {
    this.loading = true;
    
    const searchParams = {
      ItemsPerPage: 10,
      PageNumber: 1,
      IncludeTotalRowsLength: true
    };

    this.customerService.getCustomersList(searchParams).subscribe({
      next: (response) => {
        this.customers = response.RowsList || [];
        this.totalRecords = response.TotalLength;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.customers = [];
        this.totalRecords = 0;
        this.loading = false;
      }
    });
  }

  refreshCustomers() {
    this.loadCustomers();
  }

  getPaymentStatus(customer: Customer): 'positive' | 'negative' {
    const balance = parseFloat(customer.customerOpeningBalance?.toString() || '0');
    return balance >= 0 ? 'positive' : 'negative';
  }

  formatAmount(customer: Customer): string {
    const balance = parseFloat(customer.customerOpeningBalance?.toString() || '0');
    return balance >= 0 ? `+${balance}` : balance.toString();
  }
}