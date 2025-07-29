import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/interfaces';

interface SortOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    RatingModule,
    SkeletonModule,
    ToastModule,
    BadgeModule,
    TooltipModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Nos Produits</h1>
        <p class="text-gray-600 text-lg">Découvrez notre sélection de produits de qualité</p>
      </div>

      <div class="mb-8 bg-white rounded-lg shadow-sm border p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Rechercher</label>
            <input
              pInputText
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Rechercher un produit..."
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Catégorie</label>
            <p-select
              [(ngModel)]="selectedCategory"
              [options]="categoryOptions"
              (ngModelChange)="onCategoryChange($event)"
              placeholder="Toutes les catégories"
              class="w-full"
              optionLabel="label"
              optionValue="value"
            ></p-select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Trier par</label>
            <p-select
              [(ngModel)]="selectedSort"
              [options]="sortOptions"
              (ngModelChange)="onSortChange($event)"
              placeholder="Trier par..."
              class="w-full"
              optionLabel="label"
              optionValue="value"
            ></p-select>
          </div>
        </div>

        <div *ngIf="showDebugInfo()" class="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Informations de debug :</h4>
          <div class="text-xs text-gray-600 space-y-1">
            <div>Produits chargés : {{ displayedProducts().length }} / {{ allProducts().length }}</div>
            <div>Terme de recherche : "{{ searchTerm }}"</div>
            <div>Catégorie sélectionnée : {{ selectedCategory || 'Toutes' }}</div>
            <div>Tri sélectionné : {{ selectedSort || 'Aucun' }}</div>
            <div>Chargement : {{ productService.loading() }}</div>
            <div>Erreur : {{ productService.error() || 'Aucune' }}</div>
          </div>
        </div>
      </div>

      <div *ngIf="productService.loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let i of skeletonArray" class="w-full">
          <p-card>
            <p-skeleton height="200px" class="mb-4"></p-skeleton>
            <p-skeleton height="1.5rem" class="mb-2"></p-skeleton>
            <p-skeleton height="1rem" width="60%" class="mb-4"></p-skeleton>
            <p-skeleton height="2rem" width="40%"></p-skeleton>
          </p-card>
        </div>
      </div>

      <div *ngIf="productService.error()" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <i class="pi pi-exclamation-triangle text-red-500 text-2xl mb-4"></i>
          <h3 class="text-red-800 font-medium mb-2">Erreur de chargement</h3>
          <p class="text-red-700 mb-4">{{ productService.error() }}</p>
          <button
            pButton
            label="Réessayer"
            class="p-button-outlined"
            (click)="loadProducts()"
          ></button>
        </div>
      </div>

      <div *ngIf="!productService.loading() && !productService.error()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let product of displayedProducts(); trackBy: trackByProductId" class="w-full">
          <p-card class="h-full product-card hover:shadow-lg transition-shadow duration-300">
            <div class="relative mb-4">
              <img
                [src]="product.image"
                [alt]="product.title"
                class="w-full h-48 object-contain rounded-lg bg-gray-50"
                (error)="onImageError($event)"
                loading="lazy"
              />
              
              <span class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {{ formatCategory(product.category) }}
              </span>

              <span 
                *ngIf="cartService.isInCart(product.id)"
                class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
              >
                <i class="pi pi-shopping-cart"></i>
                {{ cartService.getProductQuantity(product.id) }}
              </span>
            </div>

            <div class="space-y-3">
              <h3 class="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]" [title]="product.title">
                {{ product.title }}
              </h3>

              <div class="flex items-center gap-2">
                <p-rating
                  [ngModel]="product.rating.rate"
                  [readonly]="true"
                  class="text-sm"
                ></p-rating>
                <span class="text-sm text-gray-600">({{ product.rating.count }})</span>
              </div>

              <p class="text-gray-600 text-sm line-clamp-3" [title]="product.description">
                {{ product.description }}
              </p>

              <div class="flex items-center justify-between pt-2">
                <span class="text-2xl font-bold text-blue-600">
                  {{ formatPrice(product.price) }}
                </span>
              </div>
            </div>

            <div class="mt-4 space-y-2">
              <button
                pButton
                [label]="getAddToCartLabel(product.id)"
                [icon]="cartService.isInCart(product.id) ? 'pi pi-plus' : 'pi pi-shopping-cart'"
                class="w-full p-button-raised"
                [class.p-button-success]="cartService.isInCart(product.id)"
                (click)="addToCart(product)"
              ></button>

              <div *ngIf="cartService.isInCart(product.id)" class="flex items-center gap-2">
                <button
                  pButton
                  icon="pi pi-minus"
                  class="p-button-outlined p-button-sm flex-shrink-0"
                  (click)="decrementQuantity(product.id)"
                ></button>
                
                <span class="text-center flex-grow font-medium">
                  {{ cartService.getProductQuantity(product.id) }} dans le panier
                </span>
                
                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-outlined p-button-danger p-button-sm flex-shrink-0"
                  (click)="removeFromCart(product.id)"
                ></button>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <div *ngIf="!productService.loading() && !productService.error() && displayedProducts().length === 0" class="text-center py-12">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <i class="pi pi-search text-gray-400 text-4xl mb-4"></i>
          <h3 class="text-gray-700 font-medium mb-2">Aucun produit trouvé</h3>
          <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
          <button
            pButton
            label="Réinitialiser les filtres"
            class="p-button-outlined"
            (click)="resetFilters()"
          ></button>
        </div>
      </div>

      <div class="fixed bottom-4 right-4 space-y-2">
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  readonly allProducts = signal<Product[]>([]);
  readonly displayedProducts = signal<Product[]>([]);
  private readonly debugMode = signal(false);

  searchTerm = '';
  selectedCategory = '';
  selectedSort = '';

  categoryOptions: Array<{label: string, value: string}> = [];
  sortOptions: SortOption[] = [
    { label: 'Prix croissant', value: 'price-asc' },
    { label: 'Prix décroissant', value: 'price-desc' },
    { label: 'Note croissante', value: 'rating-asc' },
    { label: 'Note décroissante', value: 'rating-desc' },
    { label: 'Alphabétique A-Z', value: 'name-asc' },
    { label: 'Alphabétique Z-A', value: 'name-desc' }
  ];

  skeletonArray = Array(8).fill(0);

  constructor() {
    
  }

  ngOnInit(): void {
    
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        
        
        this.allProducts.set(products);
        this.applyFilters();
      },
      error: (error) => {
        
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de chargement',
          detail: 'Impossible de charger les produits'
        });
      }
    });
  }

  loadCategories(): void {
    
    
    this.productService.getCategories().subscribe({
      next: (categories) => {
        
        
        this.categoryOptions = [
          { label: 'Toutes les catégories', value: '' },
          ...categories.map(cat => ({
            label: this.formatCategory(cat),
            value: cat
          }))
        ];
      },
      error: (error) => {
        
      }
    });
  }

  onSearchChange(term: string): void {
    
    this.searchTerm = term;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSortChange(sort: string): void {
    
    this.selectedSort = sort;
    this.applyFilters();
  }

  applyFilters(): void {
    

    let filtered = [...this.allProducts()];

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
      
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
      
    }

    if (this.selectedSort) {
      filtered = this.sortProducts(filtered, this.selectedSort);
      
    }

    this.displayedProducts.set(filtered);
    
  }

  private sortProducts(products: Product[], sortType: string): Product[] {
    const sorted = [...products];

    switch (sortType) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating-asc':
        return sorted.sort((a, b) => a.rating.rate - b.rating.rate);
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }

  addToCart(product: Product): void {
    

    this.cartService.addToCart(product);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Produit ajouté',
      detail: `${product.title} ajouté au panier`
    });
  }

  decrementQuantity(productId: number): void {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    

    if (currentQuantity > 1) {
      this.cartService.updateQuantity(productId, currentQuantity - 1);
    } else {
      this.removeFromCart(productId);
    }
  }

  removeFromCart(productId: number): void {
    
    
    this.cartService.removeFromCart(productId);
    
    this.messageService.add({
      severity: 'info',
      summary: 'Produit retiré',
      detail: 'Produit retiré du panier'
    });
  }

  resetFilters(): void {
    
    
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedSort = '';
    this.applyFilters();
    
    this.messageService.add({
      severity: 'info',
      summary: 'Filtres réinitialisés',
      detail: 'Tous les filtres ont été réinitialisés'
    });
  }

  formatCategory(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/['"]/g, '');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getAddToCartLabel(productId: number): string {
    return this.cartService.isInCart(productId) ? 'Ajouter +1' : 'Ajouter au panier';
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  onImageError(event: any): void {
    
    event.target.src = 'https://via.placeholder.com/300x300?text=Image+non+disponible';
  }

  showDebugInfo(): boolean {
    return this.debugMode();
  }

  toggleDebugInfo(): void {
    this.debugMode.update(mode => !mode);
    
  }

  debugComponentState(): any {
    const state = {
      allProducts: this.allProducts().length,
      displayedProducts: this.displayedProducts().length,
      filters: {
        searchTerm: this.searchTerm,
        selectedCategory: this.selectedCategory,
        selectedSort: this.selectedSort
      },
      productService: this.productService.debugCurrentState(),
      cartService: this.cartService.debugCartState()
    };
    
    return state;
  }
}