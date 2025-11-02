import { Component, OnInit, ViewChild } from '@angular/core';
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

interface SettingRow {
  id: number;
  name: string;
  number: string;
  amount: string;
  status: string;
  statusLabel: string;
  isActive: boolean;
}

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
    HeaderComponent
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('rowMenu') rowMenu!: Menu;

  searchTerm = '';
  selectedRowForMenu: SettingRow | null = null;
  rowMenuItems: MenuItem[] = [];

  // User profile data
  userProfile = {
    firstName: 'يعقوب',
    lastName: 'שגב',
    idNumber: '123456789',
    address: 'كفار قاسم، איחוד הארצישראלי',
    phone: '0541234567',
    email: 'example2000@gmail.com'
  };

  // Static table data
  settingsRows: SettingRow[] = [
    { id: 1, name: 'משאבת מאוד', number: '0123456789', amount: '50,000₪', status: 'فעال', statusLabel: 'لا فعال', isActive: false },
    { id: 2, name: 'חברת כרמל בנק אש، פרויקט', number: '0123456789', amount: '50,000₪', status: 'فعال', statusLabel: 'لا فعال', isActive: false },
    { id: 3, name: 'בניית יותק בע"מ', number: '0123456789', amount: '50,000₪', status: 'فعال', statusLabel: 'لا فعال', isActive: false },
    { id: 4, name: 'נ.ט קבלני בניין', number: '0123456789', amount: '50,000₪', status: 'فعال', statusLabel: 'لا فعال', isActive: false },
    { id: 5, name: 'השקעות נכסים בולט', number: '0123456789', amount: '50,000₪', status: 'فعال', statusLabel: 'لا فعال', isActive: false },
    { id: 6, name: 'בניית יותק בע"מ', number: '0123456789', amount: '50,000₪', status: 'فعال', statusLabel: 'لا فعال', isActive: false },
    { id: 7, name: 'נ.ט קבלני בניין', number: '0123456789', amount: '50,000₪', status: 'فعال', statusLabel: 'لا فعال', isActive: false },
    { id: 8, name: 'השקעות נכסים בולט', number: '0123456789', amount: '50,000₪', status: 'فعال', statusLabel: 'لا فعال', isActive: false },
    { id: 9, name: 'השקעות נכסים בולט', number: '0123456789', amount: '50,000₪', status: 'فعال', statusLabel: 'لا فعال', isActive: false }
  ];

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
    allowBudgetActivity: false
  };

  employeeSettings = {
    allowTimesheetEdit: true,
    sortEmployeesByDate: true,
    allowBasicSalaryActivity: false,
    allowBusinessEventActivity: true
  };

  ngOnInit() {
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    this.rowMenuItems = [
      {
        label: 'تعديل',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedRowForMenu) {
            this.editRow(this.selectedRowForMenu);
          }
        }
      },
      {
        label: 'حذف',
        icon: 'pi pi-trash',
        styleClass: 'delete-item',
        command: () => {
          if (this.selectedRowForMenu) {
            this.deleteRow(this.selectedRowForMenu);
          }
        }
      }
    ];
  }

  showRowMenu(event: Event, row: SettingRow) {
    this.selectedRowForMenu = row;
    if (this.rowMenu) {
      this.rowMenu.toggle(event);
    }
  }

  editRow(row: SettingRow) {
    console.log('Edit row:', row);
  }

  deleteRow(row: SettingRow) {
    console.log('Delete row:', row);
  }

  toggleRowStatus(row: SettingRow) {
    console.log('Toggle status:', row);
  }

  onSearchChange(value: string) {
    console.log('Search:', value);
  }

  updateProfile() {
    console.log('Update profile:', this.userProfile);
  }

  get filteredRows() {
    if (!this.searchTerm) return this.settingsRows;
    
    return this.settingsRows.filter(row => 
      row.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      row.number.includes(this.searchTerm)
    );
  }
}