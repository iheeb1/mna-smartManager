import { Component, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TabViewModule,
    PasswordModule,
    MessageModule
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
  passwordValue: string = '';
  
  showPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  returnUrl: string = '/';
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser && this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onTextSubmit() {
    console.log('Text Login:', { phone: this.textPhone, code: this.textCode });
    // TODO Implement SMS login 
  }

  onPasswordSubmit() {
    if (!this.passwordUsername || !this.passwordValue) {
      this.errorMessage = 'الرجاء إدخال اسم المستخدم وكلمة المرور';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.passwordUsername, this.passwordValue).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('تم تسجيل الدخول بنجاح:', response.data);
          
          // Use NgZone to ensure Angular detects the navigation
          this.ngZone.run(() => {
            // Navigate and reload to ensure proper state
            this.router.navigate([this.returnUrl]).then(() => {
              // Force a small delay to ensure auth state is synced
              if (this.isBrowser) {
                setTimeout(() => {
                  this.loading = false;
                }, 100);
              }
            });
          });
        } else {
          this.errorMessage = response.message || 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('خطأ في تسجيل الدخول:', error);
        this.errorMessage = error.error?.message || 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى';
        this.loading = false;
      }
    });
  }

  sendVerificationCode() {
    console.log('Sending verification code to:', this.textPhone);
    // TO DO Implement SMS verification logic 
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}