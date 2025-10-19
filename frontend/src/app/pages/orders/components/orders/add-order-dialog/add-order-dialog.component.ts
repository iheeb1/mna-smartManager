import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { OrderItem, DropdownOption, SaveOrderRequest } from '../../../models/order.model';
import { CarsService } from '../../../services/cars.service';
import { CustomersService } from '../../../services/customers.service';
import { LookupsService } from '../../../services/lookups.service';
import { OrdersService } from '../../../services/orders.service';
import { ProductsService } from '../../../services/products.service';



@Component({
  selector: 'app-add-order-dialog',
  templateUrl: './add-order-dialog.component.html',
  styleUrls: ['./add-order-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class AddOrderDialogComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onHide = new EventEmitter<void>();
  @Output() onOrderSaved = new EventEmitter<any>();

  orderData = {
    customerId: null as number | null,
    carId: null as number | null,
    addressLine1: null as string | null,
    orderDate: new Date(),
    includeVAT: true,
    contractNumber: '',
    notes: '',
  };

  currentItem = {
    productId: null as number | null,
    quantity: 0,
    price: 0,
    totalBeforeTax: 0,
    taxAmount: 0,
    totalWithTax: 0,
  };

  orderItems: OrderItem[] = [];
  taxRate: number = 0.17;

  customerOptions: DropdownOption[] = [];
  vehicleOptions: DropdownOption[] = [];
  addressOptions: DropdownOption[] = [];
  productOptions: DropdownOption[] = [];

  loading = false;

  constructor(
    private customersService: CustomersService,
    private carsService: CarsService,
    private productsService: ProductsService,
    private lookupsService: LookupsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.loading = true;

    this.lookupsService.getTaxRate().subscribe({
      next: (rate: number) => {
        this.taxRate = rate;
      },
      error: (err: any) => console.error('Error loading tax rate:', err),
    });

    this.customersService.getCustomersList({ itemsPerPage: 100 }).subscribe({
      next: (response: { success: any; data: { rowsList: any[]; }; }) => {
        if (response.success && response.data?.rowsList) {
          this.customerOptions = response.data.rowsList.map((customer: any) => ({
            label: customer.customerName,
            value: customer.customerId,
            data: customer,
          }));
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading customers:', err);
        this.loading = false;
      },
    });

    this.productsService.getProductsList({ itemsPerPage: 100 }).subscribe({
      next: (response: { success: any; data: { rowsList: any[]; }; }) => {
        if (response.success && response.data?.rowsList) {
          this.productOptions = response.data.rowsList.map((product: any) => ({
            label: `${product.productCode} - ${product.productName}`,
            value: product.productId,
            data: product,
          }));
        }
      },
      error: (err: any) => console.error('Error loading products:', err),
    });
  }

  onCustomerChange(event: any) {
    const customerId = event.value;
    if (!customerId) {
      this.vehicleOptions = [];
      this.addressOptions = [];
      return;
    }

    this.carsService.getCarsByCustomerId(customerId).subscribe({
      next: (response: { success: any; data: any[]; }) => {
        if (response.success && response.data) {
          this.vehicleOptions = response.data.map((car: any) => ({
            label: car.carNumber,
            value: car.carId,
            data: car,
          }));
        }
      },
      error: (err: any) => console.error('Error loading vehicles:', err),
    });

    this.customersService.getCustomerDetails(customerId).subscribe({
      next: (response: { success: any; data: any; }) => {
        if (response.success && response.data) {
          const customer = response.data;
          this.addressOptions = [];
          if (customer.addressLine1) {
            this.addressOptions.push({
              label: customer.addressLine1,
              value: customer.addressLine1,
              data: customer,
            });
          }
        }
      },
      error: (err: any) => console.error('Error loading customer details:', err),
    });
  }

  onProductChange(event: any) {
    const selectedProduct = this.productOptions.find((p) => p.value === event.value);
    if (selectedProduct?.data) {
      this.currentItem.price = selectedProduct.data.productPrice || 0;
      this.calculateItemTotals();
    }
  }

  onQuantityChange() {
    this.calculateItemTotals();
  }

  onPriceChange() {
    this.calculateItemTotals();
  }

  calculateItemTotals() {
    const quantity = this.currentItem.quantity || 0;
    const price = this.currentItem.price || 0;

    this.currentItem.totalBeforeTax = quantity * price;

    if (this.orderData.includeVAT) {
      this.currentItem.taxAmount = this.currentItem.totalBeforeTax * this.taxRate;
      this.currentItem.totalWithTax = this.currentItem.totalBeforeTax + this.currentItem.taxAmount;
    } else {
      this.currentItem.taxAmount = 0;
      this.currentItem.totalWithTax = this.currentItem.totalBeforeTax;
    }
  }

  addRow() {
    if (!this.currentItem.productId || this.currentItem.quantity <= 0) {
      alert('يرجى تحديد المنتج والكمية');
      return;
    }

    const selectedProduct = this.productOptions.find((p) => p.value === this.currentItem.productId);

    this.orderItems.push({
      productId: this.currentItem.productId,
      productCode: selectedProduct?.data?.productCode,
      productName: selectedProduct?.data?.productName,
      quantity: this.currentItem.quantity,
      price: this.currentItem.price,
      totalBeforeTax: this.currentItem.totalBeforeTax,
      taxAmount: this.currentItem.taxAmount,
      totalWithTax: this.currentItem.totalWithTax,
    });

    this.currentItem = {
      productId: null,
      quantity: 0,
      price: 0,
      totalBeforeTax: 0,
      taxAmount: 0,
      totalWithTax: 0,
    };
  }

  getTotalBeforeTax(): number {
    return this.orderItems.reduce((sum, item) => sum + item.totalBeforeTax, 0);
  }

  getTotalTax(): number {
    return this.orderItems.reduce((sum, item) => sum + item.taxAmount, 0);
  }

  getTotalWithTax(): number {
    return this.orderItems.reduce((sum, item) => sum + item.totalWithTax, 0);
  }

  onSave() {
    if (!this.orderData.customerId) {
      alert('يرجى اختيار العميل');
      return;
    }

    if (this.orderItems.length === 0) {
      alert('يرجى إضافة منتجات للطلب');
      return;
    }

    const saveRequest: SaveOrderRequest = {
      customerId: this.orderData.customerId,
      carId: this.orderData.carId || undefined,
      addressLine1: this.orderData.addressLine1 || undefined,
      orderDate: this.formatDate(this.orderData.orderDate),
      includeVAT: this.orderData.includeVAT,
      contractNumber: this.orderData.contractNumber,
      notes: this.orderData.notes,
      items: this.orderItems,
    };

    this.loading = true;
    this.ordersService.saveOrderItem(saveRequest).subscribe({
      next: (response: { success: any; data: any; message: string; }) => {
        this.loading = false;
        if (response.success) {
          alert('تم حفظ الطلب بنجاح');
          this.onOrderSaved.emit(response.data);
          this.closeDialog();
          this.resetForm();
        } else {
          alert('خطأ: ' + response.message);
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error saving order:', err);
        alert('حدث خطأ أثناء حفظ الطلب');
      },
    });
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  resetForm() {
    this.orderData = {
      customerId: null,
      carId: null,
      addressLine1: null,
      orderDate: new Date(),
      includeVAT: true,
      contractNumber: '',
      notes: '',
    };
    this.orderItems = [];
    this.currentItem = {
      productId: null,
      quantity: 0,
      price: 0,
      totalBeforeTax: 0,
      taxAmount: 0,
      totalWithTax: 0,
    };
  }

  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onHide.emit();
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onHide.emit();
  }
}