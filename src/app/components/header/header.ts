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
  templateUrl: './header.html',
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
    { label: 'Produits', route: '/' }
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
