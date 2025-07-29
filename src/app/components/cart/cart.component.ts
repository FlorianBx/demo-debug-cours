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
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Mon Panier</h1>
        <p class="text-gray-600 text-lg">
          {{ cartService.itemCount() }} article{{ cartService.itemCount() > 1 ? 's' : '' }} 
          dans votre panier
        </p>
      </div>

      <!-- Empty Cart State -->
      <div *ngIf="cartService.isEmpty()" class="text-center py-12">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <i class="pi pi-shopping-cart text-gray-400 text-6xl mb-6"></i>
          <h3 class="text-xl font-medium text-gray-700 mb-4">Votre panier est vide</h3>
          <p class="text-gray-600 mb-6">
            Ajoutez des produits à votre panier pour commencer vos achats
          </p>
          <button
            pButton
            label="Voir les produits"
            icon="pi pi-arrow-left"
            class="p-button-raised p-button-lg"
            (click)="goToProducts()"
          ></button>
        </div>
      </div>

      <!-- Cart Items -->
      <div *ngIf="!cartService.isEmpty()" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Items List -->
        <div class="lg:col-span-2 space-y-4">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Articles dans votre panier</h2>
          
          <div 
            *ngFor="let item of cartService.items(); trackBy: trackByItemId" 
            class="bg-white rounded-lg shadow-sm border p-6"
          >
            <div class="flex flex-col sm:flex-row gap-4">
              <!-- Product Image -->
              <div class="flex-shrink-0">
                <img
                  [src]="item.product.image"
                  [alt]="item.product.title"
                  class="w-24 h-24 object-contain rounded-lg bg-gray-50"
                  (error)="onImageError($event)"
                />
              </div>

              <!-- Product Info -->
              <div class="flex-grow">
                <div class="flex flex-col sm:flex-row justify-between">
                  <div class="flex-grow mb-4 sm:mb-0">
                    <h3 class="font-semibold text-gray-900 mb-2">{{ item.product.title }}</h3>
                    <p class="text-gray-600 text-sm mb-2 line-clamp-2">
                      {{ item.product.description }}
                    </p>
                    <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {{ formatCategory(item.product.category) }}
                    </span>
                  </div>

                  <!-- Price and Actions -->
                  <div class="flex flex-col items-end space-y-3 min-w-fit">
                    <div class="text-right">
                      <div class="text-lg font-bold text-blue-600">
                        {{ formatPrice(item.product.price) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Sous-total: {{ formatPrice(getItemTotal(item)) }}
                      </div>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center gap-3">
                      <button
                        pButton
                        icon="pi pi-minus"
                        class="p-button-outlined p-button-sm"
                        (click)="decrementQuantity(item.product.id)"
                        [disabled]="item.quantity <= 1"
                      ></button>
                      
                      <p-inputNumber
                        [(ngModel)]="item.quantity"
                        (ngModelChange)="updateQuantity(item.product.id, $event || 1)"
                        [min]="1"
                        [max]="99"
                        [showButtons]="false"
                        inputStyleClass="text-center w-16"
                        size="small"
                      ></p-inputNumber>
                      
                      <button
                        pButton
                        icon="pi pi-plus"
                        class="p-button-outlined p-button-sm"
                        (click)="incrementQuantity(item.product.id)"
                      ></button>
                    </div>

                    <!-- Remove Button -->
                    <button
                      pButton
                      label="Supprimer"
                      icon="pi pi-trash"
                      class="p-button-outlined p-button-danger p-button-sm"
                      (click)="confirmRemoveItem(item)"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Résumé de la commande</h3>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Articles ({{ cartService.itemCount() }})</span>
                <span>{{ formatPrice(cartService.totalPrice()) }}</span>
              </div>
              
              <div class="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span class="text-green-600">Gratuite</span>
              </div>
              
              <p-divider></p-divider>
              
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span class="text-blue-600">{{ formatPrice(cartService.totalPrice()) }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <button
                pButton
                label="Procéder au paiement"
                icon="pi pi-credit-card"
                class="w-full p-button-raised p-button-lg"
                (click)="proceedToCheckout()"
                [disabled]="!authService.isAuthenticated()"
              ></button>
              
              <div *ngIf="!authService.isAuthenticated()" class="text-center">
                <p class="text-sm text-gray-600 mb-2">
                  Vous devez être connecté pour passer commande
                </p>
                <button
                  pButton
                  label="Se connecter"
                  class="p-button-outlined w-full"
                  (click)="goToLogin()"
                ></button>
              </div>
              
              <button
                pButton
                label="Continuer les achats"
                class="w-full p-button-outlined"
                (click)="goToProducts()"
              ></button>
              
              <button
                pButton
                label="Vider le panier"
                icon="pi pi-times"
                class="w-full p-button-outlined p-button-danger"
                (click)="confirmClearCart()"
              ></button>
            </div>

            <!-- Debug Info -->
            <div *ngIf="showDebugInfo()" class="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Informations de debug :</h4>
              <div class="text-xs text-gray-600 space-y-1">
                <div>Nombre d'items : {{ cartService.itemCount() }}</div>
                <div>Prix total : {{ cartService.totalPrice() }}</div>
                <div>Panier vide : {{ cartService.isEmpty() }}</div>
                <div>Utilisateur connecté : {{ authService.isAuthenticated() }}</div>
                <div>Utilisateur : {{ authService.currentUser()?.name?.firstname || 'Aucun' }}</div>
              </div>
              <button
                pButton
                label="Log État Panier"
                class="p-button-text p-button-sm w-full mt-2"
                (click)="debugCartState()"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug Toggle -->
      <div class="fixed bottom-4 right-4">
        <button
          pButton
          icon="pi pi-cog"
          class="p-button-rounded p-button-outlined p-button-sm"
          (click)="toggleDebugInfo()"
          [pTooltip]="showDebugInfo() ? 'Masquer debug' : 'Afficher debug'"
        ></button>
      </div>
    </div>

    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
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
        detail: `Commande ${checkoutResult.orderId} passée avec succès. Total: ${this.formatPrice(checkoutResult.total)}`
      });

      
      setTimeout(() => {
        
        this.goToProducts();
      }, 3000);
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

  onImageError(event: any): void {
    
    event.target.src = 'https://via.placeholder.com/100x100?text=Image+non+disponible';
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