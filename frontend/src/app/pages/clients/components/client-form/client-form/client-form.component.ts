import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

interface ClientFormData {
  customerId?: number;
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
export class ClientFormComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Input() clientToEdit: any = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<ClientFormData>();
  @Output() onClose = new EventEmitter<void>();

  isMobile: boolean = false;
  showAdditionalPhone: boolean = false;
  
  // Add clientOptions property for the dropdown
  clientOptions: any[] = [];
  
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
    
    // Initialize client options (you can load from API or use static data)
    this.initializeClientOptions();
    
    if (this.clientToEdit) {
      this.formData = {
        customerId: this.clientToEdit.id ? parseInt(this.clientToEdit.id) : undefined,
        customerName: this.clientToEdit.customerName || this.clientToEdit.name || '',
        selectedCustomer: this.clientToEdit.selectedCustomer || this.clientToEdit.selectedClient || '',
        address: this.clientToEdit.address || '',
        phone: this.clientToEdit.phone || '',
        additionalPhone: this.clientToEdit.additionalPhone || '',
        email: this.clientToEdit.email || ''
      };
      
      if (this.formData.additionalPhone) {
        this.showAdditionalPhone = true;
      }
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  initializeClientOptions() {
    // Option 1: Static options for demonstration
    this.clientOptions = [
      { label: 'לקוח 1', value: 'client1' },
      { label: 'לקוח 2', value: 'client2' },
      { label: 'לקוח 3', value: 'client3' }
    ];
    
    // Option 2: If you need to load from an API service:
    // this.customerService.getCustomersList({}).subscribe(response => {
    //   this.clientOptions = response.RowsList.map(customer => ({
    //     label: customer.customerName,
    //     value: customer.customerId
    //   }));
    // });
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
    if (!this.formData.customerName || !this.formData.phone) {
      alert('الرجاء إدخال الاسم ورقم الهاتف');
      return;
    }

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
}