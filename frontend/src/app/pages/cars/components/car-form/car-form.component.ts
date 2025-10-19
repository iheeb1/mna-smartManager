import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonModule } from '@angular/common';
import { Car } from '../../models/car.models';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    ToggleButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss']
})
export class CarFormComponent implements OnInit {
  @Input() car: Car | null = null;
  @Input() isMobile = false;
  @Output() saved = new EventEmitter<Car>();
  @Output() cancelled = new EventEmitter<void>();

  carForm!: FormGroup;

  ngOnInit() {
    this.carForm = new FormBuilder().group({
      model: ['', Validators.required],
      plateNumber: ['', Validators.required],
      isActive: [true]
    });

    if (this.car) {
      this.carForm.patchValue(this.car);
    }
  }

  onSubmit() {
    if (this.carForm.valid) {
      const formValue = this.carForm.value;
      const savedCar: Car = {
        id: this.car?.id,
        model: formValue.model,
        plateNumber: formValue.plateNumber,
        isActive: formValue.isActive
      };
      this.saved.emit(savedCar);
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}