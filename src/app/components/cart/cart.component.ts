import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/interfaces';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
    BadgeModule,
    DividerModule,
    TooltipModule
  ],
  providers: [ConfirmationService],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  private readonly debugMode = signal(false);

  constructor() {
    
  }

  
  updateQuantity(productId: number, newQuantity: number): void {
    

    if (newQuantity && newQuantity > 0) {
      this.cartService.updateQuantity(productId, newQuantity);
      this.messageService.add({
        severity: 'info',
        summary: 'Quantité mise à jour',
        detail: `Quantité mise à jour: ${newQuantity}`
      });
    }
  }

  incrementQuantity(productId: number): void {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    
    
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  decrementQuantity(productId: number): void {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    

    if (currentQuantity > 1) {
      this.cartService.updateQuantity(productId, currentQuantity - 1);
    } else {
      const item = this.cartService.getCartItem(productId);
      if (item) {
        this.confirmRemoveItem(item);
      }
    }
  }

  
  confirmRemoveItem(item: CartItem): void {
    

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer "${item.product.title}" de votre panier ?`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, supprimer',
      rejectLabel: 'Annuler',
      accept: () => {
        
        
        this.cartService.removeFromCart(item.product.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Produit supprimé',
          detail: `${item.product.title} a été retiré du panier`
        });
      },
      reject: () => {
        
      }
    });
  }

  
  confirmClearCart(): void {
    

    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir vider votre panier ? Cette action supprimera tous les ${this.cartService.itemCount()} articles.`,
      header: 'Vider le panier',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, vider',
      rejectLabel: 'Annuler',
      accept: () => {
        
        
        this.cartService.clearCart();
        this.messageService.add({
          severity: 'success',
          summary: 'Panier vidé',
          detail: 'Tous les articles ont été supprimés du panier'
        });
      },
      reject: () => {
        
      }
    });
  }

  
  proceedToCheckout(): void {
    

    if (!this.authService.isAuthenticated()) {
      
      this.messageService.add({
        severity: 'warn',
        summary: 'Connexion requise',
        detail: 'Vous devez vous connecter pour passer commande'
      });
      this.goToLogin();
      return;
    }

    if (this.cartService.isEmpty()) {
      
      this.messageService.add({
        severity: 'warn',
        summary: 'Panier vide',
        detail: 'Votre panier est vide'
      });
      return;
    }

    
    const checkoutResult = this.cartService.checkout();
    

    if (checkoutResult.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Commande confirmée !',
        detail: `Commande ${checkoutResult.orderId} passée avec succès. Total: ${this.formatPrice(checkoutResult.total)}`,
        life: 5000
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de commande',
        detail: 'Une erreur est survenue lors de la commande'
      });
    }
  }

  
  goToProducts(): void {
    
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    
    this.router.navigate(['/login']);
  }

  
  getItemTotal(item: CartItem): number {
    const total = item.product.price * item.quantity;
    
    return total;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/['"]/g, '');
  }

  trackByItemId(index: number, item: CartItem): number {
    return item.product.id;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/100x100?text=Image+non+disponible';
  }

  
  showDebugInfo(): boolean {
    return this.debugMode();
  }

  toggleDebugInfo(): void {
    this.debugMode.update(mode => !mode);
    
  }

  debugCartState(): void {
    const state = this.cartService.debugCartState();
    this.messageService.add({
      severity: 'info',
      summary: 'État du panier',
      detail: `${state.itemCount} articles, total: ${this.formatPrice(state.totalPrice)}`
    });
  }
}