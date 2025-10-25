import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { Car } from '../../models/car.models';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    DialogModule
  ],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss'
})
export class CarFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Input() carToEdit: Car | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<Car>();
  @Output() onClose = new EventEmitter<void>();

  formData: Car = this.getEmptyForm();
  isMobile: boolean = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['carToEdit'] && changes['carToEdit'].currentValue) {
      // Editing existing car
      this.formData = { ...changes['carToEdit'].currentValue };
    } else if (changes['visible'] && changes['visible'].currentValue && !this.carToEdit) {
      // Adding new car
      this.resetForm();
    }
  }

  private getEmptyForm(): Car {
    return {
      id: undefined,
      carId: undefined,
      plateNumber: '',
      carNumber: '',
      model: '',
      carNotes: '',
      isActive: true,
      carStatusId: 1,
      location: '',
      objectId: 0,
      createdBy: 1,
      modifiedBy: 1
    };
  }

  resetForm(): void {
    this.formData = this.getEmptyForm();
  }

  onSubmit(): void {
    // Validate form data
    if (!this.formData.plateNumber?.trim()) {
      alert('נא להזין מספר רכב');
      return;
    }

    if (!this.formData.model?.trim()) {
      alert('נא להזין סוג רכב');
      return;
    }

    // Prepare data for backend
    const carData: Car = {
      ...this.formData,
      carNumber: this.formData.plateNumber,
      carNotes: this.formData.model,
      carStatusId: this.formData.isActive ? 1 : 0
    };

    // Emit the saved car data
    this.onSave.emit(carData);
    
    // Dialog will be closed by parent component after successful save
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onClose.emit();
    this.resetForm();
  }
}