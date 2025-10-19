import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG standalone imports
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-order-dialog',
  templateUrl: './add-order-dialog.component.html',
  styleUrls: ['./add-order-dialog.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class AddOrderDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onHide = new EventEmitter<void>();

  orderData = {
    orderDate: null,
    includeVAT: false,
  };

  customerOptions = [
    { label: 'عميل 1', value: '1' },
    { label: 'عميل 2', value: '2' },
  ];

  vehicleOptions = [
    { label: 'مركبة 1', value: '1' },
    { label: 'مركبة 2', value: '2' },
  ];

  addressOptions = [
    { label: 'عنوان 1', value: '1' },
    { label: 'عنوان 2', value: '2' },
  ];

  productOptions = [
    { label: 'منتج A', value: 'A' },
    { label: 'منتج B', value: 'B' },
  ];

  // Called by PrimeNG when dialog hides via mask click or escape
  onDialogHide(): void {
    console.log('onDialogHide triggered');
    this.visible = false;
    this.visibleChange.emit(false);
    this.onHide.emit();
  }

  // This is called whenever the visible property changes
  onVisibilityChange(isVisible: boolean): void {
    console.log('Visibility changed:', isVisible);
    if (!isVisible && this.visible) {
      // Dialog is closing
      this.visible = false;
      this.visibleChange.emit(false);
      this.onHide.emit();
    }
  }

  // Manual close method for save button
  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onHide.emit();
  }

  onSave(): void {
    console.log('Saving order...', this.orderData);
    this.closeDialog();
  }

  addRow(): void {
    console.log('Add new row');
  }
}