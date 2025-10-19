import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Car } from '../models/car.models';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../shared/components/footer-nav/footer-nav.component';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    DialogModule,
    FormsModule,
    CommonModule,
    HeaderComponent,
    FooterNavComponent
  ],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit, OnDestroy {
  cars: Car[] = [];
  selectedCar: Car | null = null;
  showDialog = false;
  searchTerm = '';
  isMobile = window.innerWidth < 768;

  // Form data
  formData = {
    plateNumber: '',
    model: '',
    isActive: false
  };

  ngOnInit() {
    this.loadCars();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  loadCars() {
    // Mock data - replace with API call
    this.cars = [
      { id: 1, model: 'מיקון', plateNumber: '1234567', isActive: true, location: 'חברת בנייה א.נ.ש, פרוייקטים' },
      { id: 2, model: 'טויוטה ראב 4', plateNumber: '1234567', isActive: false, location: 'בנייה ירקה בע"מ' },
      { id: 3, model: 'כבלניה ויהודה בע"מ', plateNumber: '4', isActive: false, location: 'חברת בנייה א.נ.ש, פרוייקטים' },
      { id: 4, model: 'נ.ע. קבלני בניין', plateNumber: '911', isActive: true, location: 'פרשת 911' },
      { id: 5, model: 'תשתיות בנייה גולן', plateNumber: 'מיקון', isActive: false, location: 'תשתיות ובנייה גולן' },
      { id: 6, model: 'משאבות מאור', plateNumber: '4', isActive: true, location: 'טויוטה ראב 4' },
      { id: 7, model: 'חברת בנייה א.נ.ש, פרוייקטים', plateNumber: 'קיה פיקנטו', isActive: true, location: 'קיה פיקנטו' }
    ];
  }

  addNewCar() {
    this.selectedCar = null;
    this.formData = {
      plateNumber: '',
      model: '',
      isActive: false
    };
    this.showDialog = true;
  }

  editCar(car: Car) {
    this.selectedCar = { ...car };
    this.formData = {
      plateNumber: car.plateNumber,
      model: car.model,
      isActive: car.isActive
    };
    this.showDialog = true;
  }

  deleteCar(car: Car) {
    if (confirm(`האם למחוק את הרכב ${car.model}?`)) {
      this.cars = this.cars.filter(c => c.id !== car.id);
    }
  }

  toggleActive(car: Car) {
    // The two-way binding handles the toggle automatically
    // You can add additional logic here if needed (e.g., API call)
    console.log(`Car ${car.id} active status changed to: ${car.isActive}`);
  }

  onSubmit() {
    if (!this.formData.plateNumber || !this.formData.model) {
      alert('נא למלא את כל השדות');
      return;
    }

    if (this.selectedCar) {
      // Edit existing car
      const index = this.cars.findIndex(c => c.id === this.selectedCar!.id);
      if (index !== -1) {
        this.cars[index] = {
          ...this.cars[index],
          plateNumber: this.formData.plateNumber,
          model: this.formData.model,
          isActive: this.formData.isActive
        };
      }
    } else {
      // Add new car
      const newId = Math.max(...this.cars.map(c => c.id || 0), 0) + 1;
      this.cars.push({
        id: newId,
        plateNumber: this.formData.plateNumber,
        model: this.formData.model,
        isActive: this.formData.isActive,
        location: 'לא ידוע'
      });
    }

    this.showDialog = false;
    this.selectedCar = null;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      plateNumber: '',
      model: '',
      isActive: false
    };
  }

  viewDetails(car: Car, event: Event) {
    event.preventDefault();
    console.log('View details for car:', car);
    // Navigate to details page or show details dialog
  }

  get filteredCars() {
    if (!this.searchTerm) {
      return this.cars;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.cars.filter(car => 
      car.model.toLowerCase().includes(term) ||
      car.plateNumber.toLowerCase().includes(term) ||
      car.location?.toLowerCase().includes(term)
    );
  }
}