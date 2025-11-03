import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

interface ClientFormData {
  customerName: string;
  selectedCustomer?: string;
  address: string;
  phone: string;
  additionalPhone?: string;
  email: string;
}

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    DropdownModule
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() clientToEdit: any = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  isMobile: boolean = false;
  showAdditionalPhone: boolean = false;
  
  // Client dropdown options
  clientOptions: any[] = [
    { label: 'לקוח 1', value: 'client1' },
    { label: 'לקוח 2', value: 'client2' },
    { label: 'לקוח 3', value: 'client3' }
  ];
  
  formData: ClientFormData = {
    customerName: '',
    selectedCustomer: '',
    address: '',
    phone: '',
    additionalPhone: '',
    email: ''
  };

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    
    if (this.clientToEdit) {
      this.formData = {
        customerName: this.clientToEdit.customerName || this.clientToEdit.name || '',
        selectedCustomer: this.clientToEdit.selectedCustomer || this.clientToEdit.selectedClient || '',
        address: this.clientToEdit.address || '',
        phone: this.clientToEdit.phone || '',
        additionalPhone: this.clientToEdit.additionalPhone || '',
        email: this.clientToEdit.email || ''
      };
      
      // Show additional phone field if there's already a value
      if (this.formData.additionalPhone) {
        this.showAdditionalPhone = true;
      }
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleAdditionalPhone() {
    this.showAdditionalPhone = !this.showAdditionalPhone;
    if (!this.showAdditionalPhone) {
      this.formData.additionalPhone = '';
    }
  }

  onSubmit() {
    this.onSave.emit(this.formData);
    this.closeDialog();
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onClose.emit();
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      customerName: '',
      selectedCustomer: '',
      address: '',
      phone: '',
      additionalPhone: '',
      email: ''
    };
    this.showAdditionalPhone = false;
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }
}