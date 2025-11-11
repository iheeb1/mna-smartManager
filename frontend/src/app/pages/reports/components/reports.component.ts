import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../shared/components/footer-nav/footer-nav.component';
import { DashboardTotals, SystemBackup, AlertAndClaim, ClearedCheck, ReportsService } from '../services/reports.services';


interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    RouterLink,
    ButtonModule,
    TableModule,
    DropdownModule,
    TabViewModule,
    HeaderComponent,
    FooterNavComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  departments: DropdownOption[] = [];
  timeRanges: DropdownOption[] = [];
  selectedDepartment: DropdownOption | null = null;
  selectedTimeRange: DropdownOption | null = null;

  // Dashboard data
  dashboardTotals: DashboardTotals = {
    totalOrders: 0,
    totalPayments: 0,
    totalExpenses: 0,
    totalAccount: 0,
  };

  systemEvaluation: SystemBackup[] = [];
  alertsAndClaims: AlertAndClaim[] = [];
  clearedChecks: ClearedCheck[] = [];

  isLoading: boolean = true;

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.initializeDropdowns();
    this.loadDashboardData();
  }

  /**
   * Initialize dropdown options
   */
  initializeDropdowns() {
    this.departments = [
      { label: 'جميع الأقسام', value: 'all' },
      { label: 'القسم 1', value: 'dept1' },
      { label: 'القسم 2', value: 'dept2' },
    ];

    this.timeRanges = [
      { label: 'جميع الأوقات', value: 'all' },
      { label: 'اليوم', value: 'today' },
      { label: 'هذا الأسبوع', value: 'week' },
      { label: 'هذا الشهر', value: 'month' },
    ];

    // Set default values
    this.selectedDepartment = this.departments[0];
    this.selectedTimeRange = this.timeRanges[0];
  }

  /**
   * Load all dashboard data
   */
  loadDashboardData() {
    this.isLoading = true;

    const dateRange = this.reportsService.getDateRange(
      this.selectedTimeRange?.value || 'all'
    );
    const customerIds = this.getCustomerIds();

    Promise.all([
      this.loadDashboardTotals(customerIds, dateRange),
      this.loadClearedChecks(customerIds, dateRange),
      this.loadAlertsAndClaims(customerIds, dateRange),
      this.loadSystemBackups(),
    ])
      .then(() => {
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      });
  }

  /**
   * Load Dashboard Totals
   */
  private async loadDashboardTotals(
    customerIds: string,
    dateRange: { fromDate: string; toDate: string }
  ) {
    try {
      this.dashboardTotals = await this.reportsService.getDashboardTotals(
        customerIds,
        dateRange
      );
    } catch (error) {
      console.error('Error loading dashboard totals:', error);
      this.dashboardTotals = {
        totalOrders: 0,
        totalPayments: 0,
        totalExpenses: 0,
        totalAccount: 0,
      };
    }
  }

  /**
   * Load Cleared Checks
   */
  private async loadClearedChecks(
    customerIds: string,
    dateRange: { fromDate: string; toDate: string }
  ) {
    try {
      this.clearedChecks = await this.reportsService.getClearedChecks(
        dateRange,
        customerIds || undefined,
        8,
        1
      );
    } catch (error) {
      console.error('Error loading cleared checks:', error);
      this.clearedChecks = [];
    }
  }

  /**
   * Load Alerts and Claims
   */
  private async loadAlertsAndClaims(
    customerIds: string,
    dateRange: { fromDate: string; toDate: string }
  ) {
    try {
      this.alertsAndClaims = await this.reportsService.getAlertsAndClaims(
        dateRange,
        customerIds || undefined,
        8,
        1
      );
    } catch (error) {
      console.error('Error loading alerts and claims:', error);
      this.alertsAndClaims = [];
    }
  }

  /**
   * Load System Backups
   */
  private async loadSystemBackups() {
    try {
      this.systemEvaluation = await this.reportsService.getSystemBackups(8, 1);
    } catch (error) {
      console.error('Error loading system backups:', error);
      this.systemEvaluation = [];
    }
  }

  /**
   * Get customer IDs based on selected department
   */
  getCustomerIds(): string {
    if (!this.selectedDepartment || this.selectedDepartment.value === 'all') {
      return '';
    }

    // Map department to customer IDs
    // Example implementation:
    const departmentCustomerMap: Record<string, string> = {
      dept1: '1,2,3',
      dept2: '4,5,6',
    };

    return departmentCustomerMap[this.selectedDepartment.value] || '';
  }

  /**
   * Handle department change
   */
  onDepartmentChange() {
    this.loadDashboardData();
  }

  /**
   * Handle time range change
   */
  onTimeRangeChange() {
    this.loadDashboardData();
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  }

  /**
   * Check if amount is negative
   */
  isNegative(amount: number): boolean {
    return amount < 0;
  }
}