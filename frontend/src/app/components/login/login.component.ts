import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TabViewModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Text login
  textPhone: string = '';
  textCode: string = '';
  
  // Password login
  passwordUsername: string = '';
  passwordEmail: string = '';
  passwordPhone: string = '';
  passwordValue: string = '';
  
  showPassword: boolean = false;

  onTextSubmit() {
    console.log('Text Login:', { phone: this.textPhone, code: this.textCode });
  }

  onPasswordSubmit() {
    console.log('Password Login:', {
      username: this.passwordUsername,
      email: this.passwordEmail,
      phone: this.passwordPhone,
      password: this.passwordValue
    });
  }

  sendVerificationCode() {
    console.log('Sending verification code to:', this.textPhone);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}