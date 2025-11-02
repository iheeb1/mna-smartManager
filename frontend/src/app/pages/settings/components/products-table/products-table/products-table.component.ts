import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';

export interface ProductTableColumn {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'status' | 'toggle' | 'actions';
  flex?: string;
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
    InputSwitchModule
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
  
  searchTerm: string = '';
  filteredRows: ProductTableRow[] = [];
  isEditMode: boolean = false;
  selectedRows: Set<number> = new Set();
  selectAll: boolean = false;

  ngOnInit() {
    this.updateFilteredRows();
  }

  ngOnChanges(changes: SimpleChanges) {
    // When config changes (tab change), update the filtered rows
    if (changes['config'] && !changes['config'].firstChange) {
      this.searchTerm = ''; // Reset search when changing tabs
      this.updateFilteredRows();
      this.resetSelections();
    }
  }

  private updateFilteredRows() {
    this.filteredRows = this.config?.data ? [...this.config.data] : [];
  }

  private resetSelections() {
    this.isEditMode = false;
    this.selectedRows.clear();
    this.selectAll = false;
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.resetSelections();
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

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.selectedRows.clear();
      this.selectAll = false;
    }
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.filteredRows.forEach((_, index) => this.selectedRows.add(index));
    } else {
      this.selectedRows.clear();
    }
  }

  toggleRowSelection(index: number) {
    if (this.selectedRows.has(index)) {
      this.selectedRows.delete(index);
    } else {
      this.selectedRows.add(index);
    }
    this.selectAll = this.selectedRows.size === this.filteredRows.length;
  }

  isRowSelected(index: number): boolean {
    return this.selectedRows.has(index);
  }

  onEdit(row: ProductTableRow) {
    this.edit.emit(row);
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
}