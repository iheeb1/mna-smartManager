import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

export interface ProductTableColumn {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'status' | 'toggle' | 'actions';
  flex?: string;
  editable?: boolean;
}

export interface ProductTableRow {
  [key: string]: any;
}

export interface ProductTableConfig {
  columns: ProductTableColumn[];
  data: ProductTableRow[];
  searchPlaceholder?: string;
  addButtonText?: string;
}

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputSwitchModule,
    MenuModule
  ],
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent implements OnInit, OnChanges {
  @Input() config!: ProductTableConfig;
  @Input() tabs: string[] = [];
  @Input() activeTabIndex: number = 0;
  
  @Output() tabChange = new EventEmitter<number>();
  @Output() edit = new EventEmitter<ProductTableRow>();
  @Output() delete = new EventEmitter<ProductTableRow>();
  @Output() add = new EventEmitter<void>();
  @Output() save = new EventEmitter<ProductTableRow>();
  
  searchTerm: string = '';
  filteredRows: ProductTableRow[] = [];
  editingRowIndex: number | null = null;
  editingRowData: ProductTableRow | null = null;
  showModal: boolean = false;
  isEditMode: boolean = false;
  modalData: any = {};
  mobileMenuItems: MenuItem[] = [];
  showSlideMenu: boolean = false;
  @ViewChild('mobileMenu') mobileMenu!: Menu;
  
  ngOnInit() {
    this.updateFilteredRows();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && !changes['config'].firstChange) {
      this.searchTerm = '';
      this.updateFilteredRows();
      this.cancelEdit();
    }
  }

  private updateFilteredRows() {
    this.filteredRows = this.config?.data ? [...this.config.data] : [];
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.cancelEdit();
    this.tabChange.emit(index);
  }

  onSearchChange(term: string) {
    if (!term.trim()) {
      this.updateFilteredRows();
      return;
    }

    const searchLower = term.toLowerCase();
    this.filteredRows = this.config.data.filter(row => {
      return Object.values(row).some(value => 
        value?.toString().toLowerCase().includes(searchLower)
      );
    });
  }

  onEdit(row: ProductTableRow, index: number) {
    this.editingRowIndex = index;
    // Create a deep copy of the row for editing
    this.editingRowData = JSON.parse(JSON.stringify(row));
  }

  onSave() {
    if (this.editingRowData && this.editingRowIndex !== null) {
      // Update the original data
      this.filteredRows[this.editingRowIndex] = { ...this.editingRowData };
      this.save.emit(this.editingRowData);
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingRowIndex = null;
    this.editingRowData = null;
  }

  isRowEditing(index: number): boolean {
    return this.editingRowIndex === index;
  }

  onDelete(row: ProductTableRow) {
    this.delete.emit(row);
  }

  onAdd() {
    this.add.emit();
  }

  getColumnFlex(column: ProductTableColumn): string {
    return column.flex || '1';
  }

  getCellValue(row: ProductTableRow, column: ProductTableColumn): any {
    return row[column.field];
  }

  getEditValue(column: ProductTableColumn): any {
    return this.editingRowData?.[column.field];
  }

  setEditValue(column: ProductTableColumn, value: any) {
    if (this.editingRowData) {
      this.editingRowData[column.field] = value;
    }
  }

  getColumnLabel(column: ProductTableColumn): string {
    return column.header;
  }

  showAddModal() {
    this.isEditMode = false;
    this.modalData = {};
    
    // Check if mobile (screen width <= 768px)
    if (window.innerWidth <= 768) {
      this.showSlideMenu = true;
    } else {
      this.showModal = true;
    }
  }
  
  onSlideMenuOptionClick(option: 'edit' | 'delete') {
    this.showSlideMenu = false;
    
    if (option === 'edit') {
      // Wait for slide animation to complete before showing modal
      setTimeout(() => {
        this.showModal = true;
      }, 300);
    } else if (option === 'delete') {
      // Handle delete option if needed
      // this.onDelete(someRow);
    }
  }
  
  closeSlideMenu() {
    this.showSlideMenu = false;
  }
  
  editInModal(row: any) {
    this.isEditMode = true;
    this.modalData = { ...row };
    this.showModal = true;
  }
  
  closeModal() {
    this.showModal = false;
    this.modalData = {};
  }
  
  saveModal() {
    if (this.isEditMode) {
      // Update existing item
      this.onEdit(this.modalData, -1);
    } else {
      // Add new item
      this.onAdd();
    }
    this.closeModal();
  }
  
  getModalTitle(): string {
    switch(this.activeTabIndex) {
      case 0: return 'משאבות מאור';
      case 1: return 'إضافة بنك جديد';
      case 2: return 'إضافة حالة جديدة';
      case 3: return 'إضافة عنوان جديد';
      case 4: return 'إضافة نوع دفع جديد';
      default: return 'إضافة عنصر جديد';
    }
  }
  
  getEditableColumns() {
    // Return all columns except the actions column
    return this.config.columns.filter(col => col.type !== 'actions');
  }
  
  showMobileMenu(event: Event, row: any) {
    this.mobileMenuItems = [
      {
        label: 'تعديل',
        icon: 'pi pi-pencil',
        command: () => this.editInModal(row)
      },
      {
        label: 'حذف',
        icon: 'pi pi-trash',
        styleClass: 'delete-item',
        command: () => this.onDelete(row)
      }
    ];
    this.mobileMenu.toggle(event);
  }
}