import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss']
})
export class FooterNavComponent {
  navItems = [
    { icon: 'assets/images/icons/settings_icon.svg', label: 'الإعدادات', route: '#', active: true },
    { icon: 'assets/images/icons/profile_icon.svg', label: 'العملاء', route: '#', active: false },
    { icon: 'assets/images/icons/truck_icon.svg', label: 'المركبات', route: '#', active: false },
    { icon: 'assets/images/icons/register_icon.svg', label: 'التقارير', route: '#', active: false },
    { icon: 'assets/images/icons/payments_icon.svg', label: 'المدفوعات', route: '#', active: false },
    { icon: 'assets/images/icons/box_icon.svg', label: 'الطلبات', route: '#', active: false }
  ];

  onNavClick(index: number) {
    this.navItems.forEach((item, i) => {
      item.active = i === index;
    });
  }
}