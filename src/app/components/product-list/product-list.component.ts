import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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

interface ComponentDebugState {
  allProducts: number;
  displayedProducts: number;
  filters: {
    searchTerm: string;
    selectedCategory: string | null;
    selectedSort: string | null;
  };
  productService: any; // Keep as any since it's from external service
  cartService: any; // Keep as any since it's from external service
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
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, OnDestroy {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  private readonly destroy$ = new Subject<void>();
  readonly allProducts = signal<Product[]>([]);
  readonly displayedProducts = signal<Product[]>([]);
  private readonly debugMode = signal(false);

  // Computed signals for template logic
  readonly showProductGrid = computed(() => 
    !this.productService.loading() && !this.productService.error()
  );
  
  readonly showEmptyState = computed(() => 
    !this.productService.loading() && 
    !this.productService.error() && 
    this.displayedProducts().length === 0
  );

  readonly isDataReady = computed(() => 
    !this.productService.loading() && !this.productService.error()
  );

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    
    
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    
    
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  // Computed signal for cart button state
  getCartButtonState = (productId: number) => computed(() => ({
    isInCart: this.cartService.isInCart(productId),
    label: this.cartService.isInCart(productId) ? 'Ajouter +1' : 'Ajouter au panier',
    icon: this.cartService.isInCart(productId) ? 'pi pi-plus' : 'pi pi-shopping-cart',
    styleClass: this.cartService.isInCart(productId) ? 'p-button-success' : ''
  }));

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x300?text=Image+non+disponible';
  }

  showDebugInfo(): boolean {
    return this.debugMode();
  }

  toggleDebugInfo(): void {
    this.debugMode.update(mode => !mode);
    
  }

  debugComponentState(): ComponentDebugState {
    const state: ComponentDebugState = {
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