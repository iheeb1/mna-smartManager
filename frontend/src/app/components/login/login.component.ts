// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules (v17.18.0 - NgModule-based)
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DialogModule,
    RippleModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passwordDialogVisible = false;
  textDialogVisible = false;

  mobileUsername = '';
  mobilePassword = '';
  mobileId = '';
  mobilePhoneNumber = '0509100726';

  desktopPassword = '';
  desktopId = '12345678';
  desktopTextId = '0509100726';
  desktopTextCode = '';

  mobileActiveTab1 = 'password'; 
  mobileActiveTab2 = 'sms';     

  showPasswordDialog() {
    this.passwordDialogVisible = true;
  }

  hidePasswordDialog() {
    this.passwordDialogVisible = false;
  }

  onPasswordDialogHide() {
    this.passwordDialogVisible = false;
  }

  showTextDialog() {
    this.textDialogVisible = true;
  }

  hideTextDialog() {
    this.textDialogVisible = false;
  }

  onTextDialogHide() {
    this.textDialogVisible = false;
  }

  onMobileLogin() {
    console.log('Mobile login:', {
      username: this.mobileUsername,
      password: this.mobilePassword,
      id: this.mobileId
    });
  }

  onDesktopPasswordLogin() {
    console.log('Desktop password login:', {
      password: this.desktopPassword,
      id: this.desktopId
    });
    this.hidePasswordDialog();
  }

  onDesktopTextLogin() {
    console.log('Desktop text login:', {
      code: this.desktopTextCode,
      id: this.desktopTextId
    });
    this.hideTextDialog();
  }

  sendTextCode() {
    console.log('Sending text code to:', this.mobilePhoneNumber);
  }
}