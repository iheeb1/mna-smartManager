import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

interface PaymentData {
  paymentDate: Date | null;
  paymentMethod: string;
  bank: string;
  accountNumber: string;
  asmachta: string;
  amount: number | null;
  notes: string;
}

interface Transfer {
  bank: string;
  accountNumber: string;
  asmachta: string;
  amount: number;
}

interface Check {
  bank: string;
  checkNumber: string;
  accountNumber: string;
  date: string;
  amount: number;
}

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    TooltipModule
  ],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss'
})
export class PaymentModalComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<PaymentData>();
  @Output() onClose = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  formData: PaymentData = this.getEmptyForm();
  isMobile: boolean = false;

  // Dropdown options
  paymentMethodOptions = [
    { label: 'تحويل بنكي', value: 'bank_transfer' },
    { label: 'شيك', value: 'check' },
    { label: 'نقدي', value: 'cash' },
    { label: 'بطاقة ائتمان', value: 'credit_card' }
  ];

  bankOptions = [
    { label: 'بنك هبوعليم', value: 'hapoalim' },
    { label: 'بنك لئومي', value: 'leumi' },
    { label: 'بنك ديسكونت', value: 'discount' },
    { label: 'בנק מזרחי', value: 'mizrahi' }
  ];

  // Sample data for transfers and checks
  transfers: Transfer[] = [
    {
      bank: 'بنك',
      accountNumber: 'مسيفر حسفون',
      asmachta: 'اسماحتا',
      amount: 1500
    }
  ];

  checks: Check[] = [
    {
      bank: 'بنك بنك',
      checkNumber: 'مسيفر شيق 123456789',
      accountNumber: 'مسيفر حسفون',
      date: '11/09/2024',
      amount: 1500
    }
  ];

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private getEmptyForm(): PaymentData {
    return {
      paymentDate: null,
      paymentMethod: '',
      bank: '',
      accountNumber: '',
      asmachta: '',
      amount: null,
      notes: ''
    };
  }

  resetForm(): void {
    this.formData = this.getEmptyForm();
  }

  addPaymentMethod(): void {
    console.log('Add payment method');
    // Implement add payment method logic
  }

  deleteTransfer(index: number): void {
    this.transfers.splice(index, 1);
  }

  editTransfer(index: number): void {
    console.log('Edit transfer:', this.transfers[index]);
    // Implement edit transfer logic
  }

  deleteCheck(index: number): void {
    this.checks.splice(index, 1);
  }

  editCheck(index: number): void {
    console.log('Edit check:', this.checks[index]);
    // Implement edit check logic
  }

  onSubmit(): void {
    // Validate form data
    if (!this.formData.paymentDate) {
      alert('يرجى اختيار تاريخ الدفع');
      return;
    }

    if (!this.formData.amount || this.formData.amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }

    // Emit the saved payment data
    this.onSave.emit(this.formData);
    
    // Reset form after save
    this.resetForm();
  }

  onDialogHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onHide.emit();
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onCancel.emit();
  }
}