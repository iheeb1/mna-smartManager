import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss']
})
export class FooterNavComponent {
  navItems = [
    { icon: 'assets/images/icons/settings_icon.svg', label: 'الإعدادات', route: '/settings' },
    { icon: 'assets/images/icons/profile_icon.svg', label: 'العملاء', route: '/customers' },
    { icon: 'assets/images/icons/truck_icon.svg', label: 'المركبات', route: '/cars' },
    { icon: 'assets/images/icons/register_icon.svg', label: 'التقارير', route: '/reports' },
    { icon: 'assets/images/icons/payments_icon.svg', label: 'المدفوعات', route: '/payments' },
    { icon: 'assets/images/icons/box_icon.svg', label: 'الطلبات', route: '/orders' }
  ];
}