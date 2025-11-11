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
    { icon: 'assets/icons/settings_icon.svg', label: 'الإعدادات', route: '/settings' },
    { icon: 'assets/icons/profile_icon.svg', label: 'العملاء', route: '/customers' },
    { icon: 'assets/icons/truck_icon.svg', label: 'المركبات', route: '/cars' },
    { icon: 'assets/icons/register_icon.svg', label: 'التقارير', route: '/reports' },
    { icon: 'assets/icons/box_icon.svg', label: 'الطلبات', route: '/orders' }
  ];
}