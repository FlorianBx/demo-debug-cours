import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

interface NavigationItem {
  label: string;
  route: string;
  external?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, BadgeModule, ToastModule, TooltipModule],
  template: `
    <header class="bg-white shadow-md border-b border-gray-200">
      <div class="container mx-auto px-4">
        <nav class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-2 cursor-pointer" (click)="navigateTo('/')">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">S</span>
            </div>
            <span class="text-xl font-bold text-gray-800">E-Shop</span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <nav class="flex items-center space-x-6">
              <a 
                *ngFor="let item of navigationItems" 
                [routerLink]="item.route"
                class="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
                routerLinkActive="text-blue-600 font-semibold"
              >
                {{ item.label }}
              </a>
            </nav>

            <!-- Actions -->
            <div class="flex items-center space-x-4">
              <!-- Cart Button -->
              <button 
                type="button"
                pButton
                icon="pi pi-shopping-cart"
                class="p-button-outlined p-button-rounded relative"
                (click)="navigateTo('/cart')"
                [attr.data-badge]="cartService.itemCount()"
              >
              </button>

              <!-- Auth Buttons -->
              <div *ngIf="!authService.isAuthenticated(); else userMenu" class="flex items-center space-x-2">
                <button 
                  type="button"
                  pButton
                  label="Se connecter"
                  class="p-button-text"
                  (click)="navigateTo('/login')"
                >
                </button>
              </div>

              <ng-template #userMenu>
                <div class="flex items-center space-x-3">
                  <span class="text-gray-700">Bonjour, {{ authService.currentUser()?.name?.firstname }}!</span>
                  <button 
                    type="button"
                    pButton
                    label="Déconnexion"
                    class="p-button-outlined p-button-sm"
                    (click)="logout()"
                  >
                  </button>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- Mobile Actions -->
          <div class="md:hidden flex items-center space-x-2">
            <!-- Mobile Cart -->
            <button 
              type="button"
              pButton
              icon="pi pi-shopping-cart"
              class="p-button-outlined p-button-rounded p-button-sm relative"
              (click)="navigateTo('/cart')"
              [attr.data-badge]="cartService.itemCount()"
            >
            </button>
            
            <!-- Mobile Menu Button -->
            <button 
              type="button"
              class="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              (click)="toggleMobileMenu()"
              [attr.aria-expanded]="mobileMenuOpen()"
              aria-label="Toggle mobile menu"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  *ngIf="!mobileMenuOpen()" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path 
                  *ngIf="mobileMenuOpen()" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </nav>

        <!-- Mobile Menu -->
        <div 
          class="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          [class.max-h-96]="mobileMenuOpen()"
          [class.max-h-0]="!mobileMenuOpen()"
        >
          <div class="py-4 space-y-4 border-t border-gray-200">
            <div class="flex flex-col space-y-3">
              <a 
                *ngFor="let item of navigationItems" 
                [routerLink]="item.route"
                class="block px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium"
                routerLinkActive="text-blue-600 bg-blue-50 font-semibold"
                (click)="closeMobileMenu()"
              >
                {{ item.label }}
              </a>
            </div>
            
            <div class="flex flex-col space-y-3 pt-4 border-t border-gray-200">
              <div *ngIf="!authService.isAuthenticated(); else mobileUserMenu">
                <button 
                  type="button"
                  pButton
                  label="Se connecter"
                  class="w-full p-button-outlined"
                  (click)="navigateToAndClose('/login')"
                >
                </button>
              </div>
              
              <ng-template #mobileUserMenu>
                <div class="px-4 py-2 text-gray-700 font-medium">
                  Bonjour, {{ authService.currentUser()?.name?.firstname }}!
                </div>
                <button 
                  type="button"
                  pButton
                  label="Déconnexion"
                  class="w-full p-button-outlined"
                  (click)="logout(); closeMobileMenu()"
                >
                </button>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <p-toast></p-toast>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  
  mobileMenuOpen = signal(false);
  
  navigationItems: NavigationItem[] = [
    { label: 'Produits', route: '/' },
    { label: 'Panier', route: '/cart' }
  ];

  constructor() {
    
  }
  
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToAndClose(route: string): void {
    this.navigateTo(route);
    this.closeMobileMenu();
  }

  logout(): void {
    
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Déconnexion',
      detail: 'Vous avez été déconnecté avec succès'
    });
    this.navigateTo('/');
  }
}