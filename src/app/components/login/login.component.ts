import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/interfaces';

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
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Connexion à E-Shop</h1>
          <p class="text-gray-600">Connectez-vous pour accéder à votre compte</p>
        </div>

        <p-card>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-2">
              <label for="username" class="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                pInputText
                formControlName="username"
                placeholder="Entrez votre nom d'utilisateur"
                class="w-full"
                [class.ng-invalid]="isFieldInvalid('username')"
              />
              <small 
                *ngIf="isFieldInvalid('username')" 
                class="text-red-500"
              >
                Le nom d'utilisateur est requis
              </small>
            </div>

            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <p-password
                id="password"
                formControlName="password"
                placeholder="Entrez votre mot de passe"
                [feedback]="false"
                [toggleMask]="true"
                styleClass="w-full"
                inputStyleClass="w-full"
                [class.ng-invalid]="isFieldInvalid('password')"
              ></p-password>
              <small 
                *ngIf="isFieldInvalid('password')" 
                class="text-red-500"
              >
                Le mot de passe est requis
              </small>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="text-sm font-medium text-blue-800 mb-2">Comptes de démonstration :</h3>
              <div class="text-sm text-blue-700 space-y-1">
                <div><strong>Admin :</strong> admin / admin</div>
                <div><strong>Demo :</strong> demo / demo</div>
              </div>
            </div>

            <button
              type="submit"
              pButton
              [label]="authService.isLoading() ? 'Connexion...' : 'Se connecter'"
              [loading]="authService.isLoading()"
              [disabled]="loginForm.invalid || authService.isLoading()"
              class="w-full p-button-lg"
            ></button>

            <div *ngIf="showDebugInfo()" class="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Informations de debug :</h4>
              <div class="text-xs text-gray-600 space-y-1">
                <div>Formulaire valide : {{ loginForm.valid }}</div>
                <div>Champs touchés : {{ getTouchedFields() }}</div>
                <div>Erreurs : {{ getFormErrors() }}</div>
                <div>État d'authentification : {{ authService.isAuthenticated() }}</div>
                <div>Chargement : {{ authService.isLoading() }}</div>
              </div>
            </div>
          </form>
        </p-card>

        <div class="mt-6 text-center">
          <button
            type="button"
            pButton
            label="Debug: Remplir Admin"
            class="p-button-outlined p-button-sm mr-2"
            (click)="fillAdminCredentials()"
          ></button>
          <button
            type="button"
            pButton
            label="Debug: Remplir Demo"
            class="p-button-outlined p-button-sm mr-2"
            (click)="fillDemoCredentials()"
          ></button>
          <button
            type="button"
            pButton
            label="Toggle Debug"
            class="p-button-text p-button-sm"
            (click)="toggleDebugInfo()"
          ></button>
        </div>
      </div>
    </div>

    <p-toast></p-toast>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  readonly authService = inject(AuthService);

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

      this.authService.login(credentials).subscribe({
        next: (response) => {
          
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Connexion réussie',
              detail: `Bienvenue ${response.user?.name.firstname}!`
            });
            
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1500);
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

  debugFormState(): any {
    const state = {
      formValue: this.loginForm.value,
      formValid: this.loginForm.valid,
      formErrors: this.getFormErrors(),
      touchedFields: this.getTouchedFields(),
      authState: this.authService.debugCurrentState()
    };
    return state;
  }
}