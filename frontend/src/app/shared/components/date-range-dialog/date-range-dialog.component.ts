import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface CalendarDay {
  day: number;
  date: Date;
  currentMonth: boolean;
}

@Component({
  selector: 'app-date-range-dialog',
  templateUrl: './date-range-dialog.component.html',
  styleUrls: ['./date-range-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    DropdownModule,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class DateRangeDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onApplyDateRange = new EventEmitter<DateRange>();

  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  months = [
    { label: 'يناير', value: 0 },
    { label: 'فبراير', value: 1 },
    { label: 'مارس', value: 2 },
    { label: 'أبريل', value: 3 },
    { label: 'مايو', value: 4 },
    { label: 'يونيو', value: 5 },
    { label: 'يوليو', value: 6 },
    { label: 'أغسطس', value: 7 },
    { label: 'سبتمبر', value: 8 },
    { label: 'أكتوبر', value: 9 },
    { label: 'نوفمبر', value: 10 },
    { label: 'ديسمبر', value: 11 },
  ];

  years: { label: string; value: number }[] = [];

  arabicLocale = {
    firstDayOfWeek: 6,
    dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
    dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    monthNamesShort: ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'],
    today: 'اليوم',
    clear: 'مسح',
  };

  constructor() {
    this.generateYears();
    this.selectedMonth = new Date().getMonth();
    this.selectedYear = new Date().getFullYear();
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push({ label: i.toString(), value: i });
    }
  }

  getCalendarDays(month: number, year: number): CalendarDay[] {
    const days: CalendarDay[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    
    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        day: prevMonthLastDay - i,
        date: date,
        currentMonth: false
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        date: date,
        currentMonth: true
      });
    }
    
    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        day: i,
        date: date,
        currentMonth: false
      });
    }
    
    return days;
  }

  getMonthYearTitle(month: number, year: number): string {
    return `${this.months[month].label} ${year}`;
  }

  getNextMonth(): { month: number; year: number } {
    const nextMonth = this.selectedMonth + 1;
    if (nextMonth > 11) {
      return { month: 0, year: this.selectedYear + 1 };
    }
    return { month: nextMonth, year: this.selectedYear };
  }

  selectStartDate(day: CalendarDay) {
    if (!day.currentMonth) return;
    this.startDate = day.date;
    this.applyDateRange();
  }

  selectEndDate(day: CalendarDay) {
    if (!day.currentMonth) return;
    this.endDate = day.date;
    this.applyDateRange();
  }

  isSelected(date: Date, selectedDate: Date | null): boolean {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  onMonthChange() {
    // Calendar will auto-update based on selectedMonth
  }

  onYearChange() {
    // Calendar will auto-update based on selectedYear
  }

  applyDateRange() {
    const dateRange: DateRange = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    
    this.onApplyDateRange.emit(dateRange);
  }

  onDateSelect() {
    // Auto-apply when date is selected
    this.applyDateRange();
  }

  resetDates() {
    this.startDate = null;
    this.endDate = null;
    this.selectedMonth = new Date().getMonth();
    this.selectedYear = new Date().getFullYear();
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

  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}