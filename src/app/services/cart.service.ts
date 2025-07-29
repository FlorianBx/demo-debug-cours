import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartItems = signal<CartItem[]>([]);

  readonly items = this.cartItems.asReadonly();
  readonly itemCount = computed(() => {
    const count = this.cartItems().reduce((total, item) => total + item.quantity, 0);
    return count;
  });

  readonly totalPrice = computed(() => {
    const total = this.cartItems().reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    return Number(total.toFixed(2));
  });

  readonly isEmpty = computed(() => {
    const empty = this.cartItems().length === 0;
    return empty;
  });

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(product: Product, quantity: number = 1): void {

    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      
      this.cartItems.set(updatedItems);
    } else {
      const newItem: CartItem = { product, quantity };
      const updatedItems = [...currentItems, newItem];
      
      this.cartItems.set(updatedItems);
    }

    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {

    const currentItems = this.cartItems();
    const itemToRemove = currentItems.find(item => item.product.id === productId);
    
    if (itemToRemove) {
      const updatedItems = currentItems.filter(item => item.product.id !== productId);
      
      this.cartItems.set(updatedItems);
      this.saveCartToStorage();
    }
  }

  updateQuantity(productId: number, newQuantity: number): void {

    if (newQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex >= 0) {
      const updatedItems = [...currentItems];
      const oldQuantity = updatedItems[itemIndex].quantity;
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: newQuantity
      };

      this.cartItems.set(updatedItems);
      this.saveCartToStorage();
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  isInCart(productId: number): boolean {
    const inCart = this.cartItems().some(item => item.product.id === productId);
    return inCart;
  }

  getProductQuantity(productId: number): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    const quantity = item ? item.quantity : 0;
    return quantity;
  }

  getCartItem(productId: number): CartItem | undefined {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item;
  }

  getItemTotal(productId: number): number {
    const item = this.getCartItem(productId);
    const total = item ? item.product.price * item.quantity : 0;
    return Number(total.toFixed(2));
  }

  checkout(): { success: boolean; orderId?: string; total: number } {
    const total = this.totalPrice();
    const itemCount = this.itemCount();

    if (this.isEmpty()) {
      return { success: false, total: 0 };
    }

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.clearCart();

    return { success: true, orderId, total };
  }

  private saveCartToStorage(): void {
    try {
      const cartData = JSON.stringify(this.cartItems());
      localStorage.setItem('cart', cartData);
    } catch (error) {
      // Error handling for localStorage save
    }
  }

  private loadCartFromStorage(): void {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartItems: CartItem[] = JSON.parse(storedCart);
        this.cartItems.set(cartItems);
      }
    } catch (error) {
      localStorage.removeItem('cart');
    }
  }

  debugCartState(): {
    items: CartItem[];
    itemCount: number;
    totalPrice: number;
    isEmpty: boolean;
  } {
    const state = {
      items: this.cartItems(),
      itemCount: this.itemCount(),
      totalPrice: this.totalPrice(),
      isEmpty: this.isEmpty()
    };
    return state;
  }
}