import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

export interface FilterOptions {
  vehicleType?: string;
  qiqPikonot?: boolean;
  poroshet911?: boolean;
  serviceType?: string;
  mseretRange?: [number, number];
  qvayimRange?: [number, number];
  priceRange?: [number, number];
}

@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    SliderModule,
    CheckboxModule,
    ButtonModule,
  ],
})
export class FiltersDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onApplyFilters = new EventEmitter<FilterOptions>();

  // Filter values
  vehicleType: string = '';
  qiqPikonot: boolean = false;
  poroshet911: boolean = false;
  serviceType: string = '';
  
  // Range sliders
  mseretRange: number[] = [15, 50];
  qvayimRange: number[] = [15, 50];
  priceRange: number[] = [350, 1850];

  // Expanded sections
  vehicleTypeExpanded: boolean = false;
  mseretExpanded: boolean = false;
  qvayimExpanded: boolean = false;
  priceExpanded: boolean = false;

  constructor() {}

  toggleSection(section: string) {
    switch (section) {
      case 'vehicleType':
        this.vehicleTypeExpanded = !this.vehicleTypeExpanded;
        break;
      case 'mseret':
        this.mseretExpanded = !this.mseretExpanded;
        break;
      case 'qvayim':
        this.qvayimExpanded = !this.qvayimExpanded;
        break;
      case 'price':
        this.priceExpanded = !this.priceExpanded;
        break;
    }
  }

  applyFilters() {
    const filters: FilterOptions = {
      vehicleType: this.vehicleType,
      qiqPikonot: this.qiqPikonot,
      poroshet911: this.poroshet911,
      serviceType: this.serviceType,
      mseretRange: [this.mseretRange[0], this.mseretRange[1]],
      qvayimRange: [this.qvayimRange[0], this.qvayimRange[1]],
      priceRange: [this.priceRange[0], this.priceRange[1]],
    };
    
    this.onApplyFilters.emit(filters);
    this.hideDialog();
  }

  resetFilters() {
    this.vehicleType = '';
    this.qiqPikonot = false;
    this.poroshet911 = false;
    this.serviceType = '';
    this.mseretRange = [15, 50];
    this.qvayimRange = [15, 50];
    this.priceRange = [350, 1850];
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onBackdropClick() {
    this.hideDialog();
  }

  onPanelClick(event: Event) {
    event.stopPropagation();
  }

  formatPrice(value: number): string {
    return `${value}₪`;
  }
}