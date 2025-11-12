import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
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
  branchNumber: string;
  asmachta: string;
  amount: number | null;
  notes: string;
}

interface Transfer {
  bank: string;
  accountNumber: string;
  branchNumber: string;
  asmachta: string;
  amount: number;
}

interface Check {
  bank: string;
  accountNumber: string;
  branchNumber: string;
  checkNumber: string;
  dueDate: string;
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
  @Input() customerId: number = 0;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  formData: PaymentData = this.getEmptyForm();
  isMobile: boolean = false;

  paymentMethodOptions = [
    { label: 'حوالة بنكية', value: 'bank_transfer' },
    { label: 'شيك', value: 'check' },
    { label: 'نقداً', value: 'cash' },
    { label: 'بطاقة ائتمان', value: 'credit_card' }
  ];

  bankOptions = [
    { label: 'بنك هبوعليم', value: 'hapoalim' },
    { label: 'بنك لئومي', value: 'leumi' },
    { label: 'بنك ديسكونت', value: 'discount' },
    { label: 'بنك مزراحي تفحوت', value: 'mizrahi' },
    { label: 'بنك test', value: 'israel' },
    { label: 'بنك القدس', value: 'jerusalem' }
  ];

  transfers: Transfer[] = [];
  checks: Check[] = [];

  get totalAmount(): number {
    const transferTotal = this.transfers.reduce((sum, t) => sum + t.amount, 0);
    const checkTotal = this.checks.reduce((sum, c) => sum + c.amount, 0);
    return transferTotal + checkTotal;
  }

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
      paymentDate: new Date(),
      paymentMethod: '',
      bank: '',
      accountNumber: '',
      branchNumber: '',
      asmachta: '',
      amount: null,
      notes: ''
    };
  }

  resetForm(): void {
    this.formData = this.getEmptyForm();
    this.transfers = [];
    this.checks = [];
  }

  addPaymentMethod(): void {
    console.log('إضافة وسيلة دفع');
  }

  deleteTransfer(index: number): void {
    this.transfers.splice(index, 1);
  }

  editTransfer(index: number): void {
    const transfer = this.transfers[index];
    this.formData.bank = transfer.bank;
    this.formData.accountNumber = transfer.accountNumber;
    this.formData.branchNumber = transfer.branchNumber;
    this.formData.asmachta = transfer.asmachta;
    this.formData.amount = transfer.amount;
    this.transfers.splice(index, 1);
  }

  deleteCheck(index: number): void {
    this.checks.splice(index, 1);
  }

  editCheck(index: number): void {
    console.log('تعديل الشيك:', this.checks[index]);
  }

  onSubmit(): void {
    if (this.transfers.length === 0 && this.checks.length === 0) {
      alert('يرجى إضافة حوالة أو شيك واحد على الأقل');
      return;
    }

    const paymentData = {
      customerId: this.customerId,
      paymentDate: this.formData.paymentDate,
      paymentMethod: this.formData.paymentMethod,
      transfers: this.transfers,
      checks: this.checks,
      totalAmount: this.totalAmount,
      notes: this.formData.notes
    };

    this.onSave.emit(paymentData);
    this.resetForm();
    this.closeDialog();
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

  saveTransferLine(): void {
    if (!this.formData.bank) {
      alert('يرجى اختيار البنك');
      return;
    }
    
    if (!this.formData.branchNumber) {
      alert('يرجى إدخال رقم الفرع');
      return;
    }
    
    if (!this.formData.accountNumber) {
      alert('يرجى إدخال رقم الحساب');
      return;
    }
    
    if (!this.formData.asmachta) {
      alert('يرجى إدخال الإسمختا');
      return;
    }
    
    if (!this.formData.amount || this.formData.amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }
  
    const newTransfer: Transfer = {
      bank: this.formData.bank,
      accountNumber: this.formData.accountNumber,
      branchNumber: this.formData.branchNumber,
      asmachta: this.formData.asmachta,
      amount: this.formData.amount
    };
  
    this.transfers.push(newTransfer);
  
    this.formData.bank = '';
    this.formData.accountNumber = '';
    this.formData.branchNumber = '';
    this.formData.asmachta = '';
    this.formData.amount = null;
  }
}