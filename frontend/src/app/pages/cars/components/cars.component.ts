import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Car, CarsListParams } from '../models/car.models';
import { CarsService, CarResponse } from '../services/car.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterNavComponent } from '../../../shared/components/footer-nav/footer-nav.component';
import { CarFormComponent } from './car-form/car-form.component';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    HeaderComponent,
    FooterNavComponent,
    CarFormComponent,
    ToastModule,
    ProgressSpinnerModule,
    MenuModule
  ],
  providers: [MessageService],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent implements OnInit, OnDestroy {
  @ViewChild('carMenu') carMenu!: Menu;
  
  cars: Car[] = [];
  selectedCar: Car | null = null;
  selectedCarForMenu: Car | null = null;
  showDialog = false;
  searchTerm = '';
  isMobile = window.innerWidth < 768;
  loading = false;
  totalCars = 0;
  currentPage = 0;
  itemsPerPage = 50;
  carMenuItems: MenuItem[] = [];

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(
    private carsService: CarsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initializeMenuItems();
    this.loadCars();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    
    // Setup search debouncing
    this.searchSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.loadCars();
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  private initializeMenuItems() {
    this.carMenuItems = [
      {
        label: 'تعديل',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedCarForMenu) {
            this.editCar(this.selectedCarForMenu);
          }
        }
      },
      {
        label: 'حذف',
        icon: 'pi pi-trash',
        styleClass: 'delete-item',
        command: () => {
          if (this.selectedCarForMenu) {
            this.deleteCar(this.selectedCarForMenu);
          }
        }
      }
    ];
  }

  showCarMenu(event: Event, car: Car) {
    this.selectedCarForMenu = car;
    if (this.carMenu) {
      this.carMenu.toggle(event);
    }
  }

  loadCars() {
    this.loading = true;
    
    const params: CarsListParams = {
      itemsPerPage: this.itemsPerPage,
      pageNumber: this.currentPage,
      searchTerm: this.searchTerm,
      includeTotalRowsLength: true
    };

    this.carsService.getCarsList(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: { rowsList: CarResponse[]; totalLength: number; }) => {
          this.cars = this.mapCarResponses(response.rowsList);
          this.totalCars = response.totalLength;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading cars:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحميل المركبات'
          });
          this.cars = [];
          this.loading = false;
        }
      });
  }

  private mapCarResponses(responses: CarResponse[]): Car[] {
    return responses.map(r => ({
      id: r.carId,
      carId: r.carId,
      plateNumber: r.carNumber || '',
      carNumber: r.carNumber,
      model: r.carNotes || 'غير محدد',
      carNotes: r.carNotes,
      isActive: r.carStatusId === 1,
      carStatusId: r.carStatusId,
      location: '', // Can be mapped from objectId if needed
      objectId: r.objectId,
      createdBy: r.createdBy,
      modifiedBy: r.modifiedBy,
      createdDate: r.createdDate,
      modifiedDate: r.modifiedDate
    }));
  }

  private mapCarToBackend(car: Car): Partial<CarResponse> {
    return {
      carId: car.carId || car.id,
      carNumber: car.plateNumber || car.carNumber,
      carNotes: car.model || car.carNotes,
      carStatusId: car.isActive ? 1 : 0,
      objectId: car.objectId || 0,
      createdBy: car.createdBy || 1,
      modifiedBy: car.modifiedBy || 1
    };
  }

  onSearchChange(value: string) {
    this.searchSubject$.next(value);
  }

  addNewCar() {
    this.selectedCar = null;
    this.showDialog = true;
  }

  editCar(car: Car) {
    this.selectedCar = { ...car };
    this.showDialog = true;
  }

  deleteCar(car: Car) {
    if (confirm(`هل تريد حذف المركبة ${car.model}؟`)) {
      this.loading = true;
      const carId = car.carId || car.id;
      
      if (!carId) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'معرف المركبة غير صالح'
        });
        return;
      }

      this.carsService.deleteCar(carId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم حذف المركبة بنجاح'
            });
            this.loadCars();
          },
          error: (error: any) => {
            console.error('Error deleting car:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في حذف المركبة'
            });
            this.loading = false;
          }
        });
    }
  }

  toggleActive(car: Car) {
    const carData = this.mapCarToBackend(car);
    this.loading = true;

    this.carsService.saveCar(carData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: `تم ${car.isActive ? 'تفعيل' : 'إلغاء تفعيل'} المركبة`
          });
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error toggling car status:', error);
          car.isActive = !car.isActive; // Revert the change
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحديث حالة المركبة'
          });
          this.loading = false;
        }
      });
  }

  onCarSaved(car: Car) {
    const carData = this.mapCarToBackend(car);
    this.loading = true;

    this.carsService.saveCar(carData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: car.carId ? 'تم تحديث المركبة بنجاح' : 'تم إضافة المركبة بنجاح'
          });
          this.showDialog = false;
          this.selectedCar = null;
          this.loadCars();
        },
        error: (error: any) => {
          console.error('Error saving car:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في حفظ المركبة'
          });
          this.loading = false;
        }
      });
  }

  onDialogClose() {
    this.showDialog = false;
    this.selectedCar = null;
  }

  viewDetails(car: Car, event: Event) {
    event.preventDefault();
    const carId = car.carId || car.id;
    
    if (!carId) return;

    this.loading = true;
    this.carsService.getCarDetails(carId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log('Car details:', response);
          // Navigate to details page or show details in dialog
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error fetching car details:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحميل تفاصيل المركبة'
          });
          this.loading = false;
        }
      });
  }

  get filteredCars() {
    return this.cars;
  }

  get isEmpty() {
    return !this.loading && this.cars.length === 0;
  }
}