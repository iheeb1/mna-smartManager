import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';

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
  @Output() save = new EventEmitter<ProductTableRow>();
  
  searchTerm: string = '';
  filteredRows: ProductTableRow[] = [];
  editingRowIndex: number | null = null;
  editingRowData: ProductTableRow | null = null;

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
}