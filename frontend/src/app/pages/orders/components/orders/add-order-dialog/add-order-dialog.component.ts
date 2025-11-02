import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
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
export class AddOrderDialogComponent implements OnInit, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onHide = new EventEmitter<void>();
  @Output() onOrderSaved = new EventEmitter<any>();

  isMobile: boolean = false;

  orderData = {
    customerId: null as number | null,
    carId: null as number | null,
    addressLine1: null as string | null,
    orderDate: new Date(),
    includeVAT: true,
    contractNumber: '',
    notes: '',
  };

  // Array to hold multiple order item rows
  orderItemRows: Array<{
    productId: number | null;
    quantity: number;
    price: number;
    totalBeforeTax: number;
    taxAmount: number;
    totalWithTax: number;
  }> = [];

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
    this.addRow();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  loadInitialData() {
    this.loading = true;

    // Load tax rate
    this.lookupsService.getTaxRate().subscribe({
      next: (rate: number) => {
        this.taxRate = rate;
      },
      error: (err: any) => console.error('Error loading tax rate:', err),
    });

    // Load customers
    this.customersService.getCustomersList({ itemsPerPage: 100 }).subscribe({
      next: (response: any) => {
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

    // Load products
    this.productsService.getProductsList({ itemsPerPage: 100 }).subscribe({
      next: (response: any) => {
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

    // Load vehicles for selected customer
    this.carsService.getCarsByCustomerId(customerId).subscribe({
      next: (response: any) => {
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

    // Load customer addresses
    this.customersService.getCustomerDetails(customerId).subscribe({
      next: (response: any) => {
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

  onProductChange(rowIndex: number, event: any) {
    const selectedProduct = this.productOptions.find((p) => p.value === event.value);
    if (selectedProduct?.data) {
      this.orderItemRows[rowIndex].price = selectedProduct.data.productPrice || 0;
      this.calculateRowTotals(rowIndex);
    }
  }

  onQuantityChange(rowIndex: number) {
    this.calculateRowTotals(rowIndex);
  }

  onPriceChange(rowIndex: number) {
    this.calculateRowTotals(rowIndex);
  }

  calculateRowTotals(rowIndex: number) {
    const row = this.orderItemRows[rowIndex];
    const quantity = row.quantity || 0;
    const price = row.price || 0;

    row.totalBeforeTax = quantity * price;

    if (this.orderData.includeVAT) {
      row.taxAmount = row.totalBeforeTax * this.taxRate;
      row.totalWithTax = row.totalBeforeTax + row.taxAmount;
    } else {
      row.taxAmount = 0;
      row.totalWithTax = row.totalBeforeTax;
    }
  }

  onVATChange() {
    // Recalculate all rows when VAT checkbox changes
    this.orderItemRows.forEach((_, index) => {
      this.calculateRowTotals(index);
    });
  }

  addRow() {
    this.orderItemRows.push({
      productId: null,
      quantity: 0,
      price: 0,
      totalBeforeTax: 0,
      taxAmount: 0,
      totalWithTax: 0,
    });
  }

  removeRow(rowIndex: number) {
    if (this.orderItemRows.length > 1) {
      this.orderItemRows.splice(rowIndex, 1);
    } else {
      alert('يجب أن يحتوي الطلب على سطر واحد على الأقل');
    }
  }

  getTotalBeforeTax(): number {
    return this.orderItemRows.reduce((sum, row) => sum + (row.totalBeforeTax || 0), 0);
  }

  getTotalTax(): number {
    return this.orderItemRows.reduce((sum, row) => sum + (row.taxAmount || 0), 0);
  }

  getTotalWithTax(): number {
    return this.orderItemRows.reduce((sum, row) => sum + (row.totalWithTax || 0), 0);
  }

  formatCurrency(value: number): string {
    if (!value) return '0.00₪';
    return `${value.toFixed(2)}₪`;
  }

  onSave() {
    // Validation
    if (!this.orderData.customerId) {
      alert('يرجى اختيار العميل');
      return;
    }

    // Filter out empty rows and validate
    const validRows = this.orderItemRows.filter(
      (row) => row.productId && row.quantity > 0
    );

    if (validRows.length === 0) {
      alert('يرجى إضافة منتج واحد على الأقل مع كمية صحيحة');
      return;
    }

    // Map rows to OrderItem format
    const orderItems: OrderItem[] = validRows.map((row) => {
      const selectedProduct = this.productOptions.find((p) => p.value === row.productId);
      return {
        productId: row.productId!,
        productCode: selectedProduct?.data?.productCode,
        productName: selectedProduct?.data?.productName,
        quantity: row.quantity,
        price: row.price,
        totalBeforeTax: row.totalBeforeTax,
        taxAmount: row.taxAmount,
        totalWithTax: row.totalWithTax,
      };
    });

    const saveRequest: SaveOrderRequest = {
      customerId: this.orderData.customerId,
      carId: this.orderData.carId || undefined,
      addressLine1: this.orderData.addressLine1 || undefined,
      orderDate: this.formatDate(this.orderData.orderDate),
      includeVAT: this.orderData.includeVAT,
      contractNumber: this.orderData.contractNumber,
      notes: this.orderData.notes,
      items: orderItems,
    };

    this.loading = true;
    this.ordersService.saveOrderItem(saveRequest).subscribe({
      next: (response: any) => {
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
    this.orderItemRows = [];
    this.addRow(); // Add one empty row
    this.vehicleOptions = [];
    this.addressOptions = [];
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