import { Component, ChangeDetectionStrategy, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/interfaces';

interface LoginDebugState {
  formValue: any;
  formValid: boolean;
  formErrors: string;
  touchedFields: string;
  authState: any; // Keep as any since it's from external service
}

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  readonly authService = inject(AuthService);

  private readonly destroy$ = new Subject<void>();
  private readonly debugMode = signal(false);

  readonly loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(2)]]
  });

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {

    if (this.loginForm.valid) {
      const credentials: LoginCredentials = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
        next: (response) => {
          
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Connexion réussie',
              detail: `Bienvenue ${response.user?.name.firstname}!`,
              life: 2000
            });
            
            this.router.navigate(['/']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Échec de connexion',
              detail: response.message || 'Identifiants invalides'
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de connexion',
            detail: 'Une erreur est survenue lors de la connexion'
          });
        }
      });
    } else {
      
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    const invalid = field ? field.invalid && (field.dirty || field.touched) : false;
    
    return invalid;
  }

  showDebugInfo(): boolean {
    return this.debugMode();
  }

  toggleDebugInfo(): void {
    this.debugMode.update(mode => !mode);
  }

  getTouchedFields(): string {
    const touchedFields = Object.keys(this.loginForm.controls)
      .filter(key => this.loginForm.get(key)?.touched)
      .join(', ');
    return touchedFields || 'aucun';
  }

  getFormErrors(): string {
    const errors: string[] = [];
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control?.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          errors.push(`${key}: ${errorKey}`);
        });
      }
    });
    return errors.length > 0 ? errors.join(', ') : 'aucune';
  }

  fillAdminCredentials(): void {
    this.loginForm.patchValue({
      username: 'admin',
      password: 'admin'
    });
    
    this.messageService.add({
      severity: 'info',
      summary: 'Credentials remplis',
      detail: 'Credentials admin remplis pour les tests'
    });
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      username: 'demo',
      password: 'demo'
    });
    
    this.messageService.add({
      severity: 'info',
      summary: 'Credentials remplis',
      detail: 'Credentials demo remplis pour les tests'
    });
  }

  debugFormState(): LoginDebugState {
    const state: LoginDebugState = {
      formValue: this.loginForm.value,
      formValid: this.loginForm.valid,
      formErrors: this.getFormErrors(),
      touchedFields: this.getTouchedFields(),
      authState: this.authService.debugCurrentState()
    };
    return state;
  }
}