import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { Product } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://fakestoreapi.com/products';

  private readonly productsSignal = signal<Product[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly products = this.productsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {

  }

  getAllProducts(): Observable<Product[]> {


    this.setLoading(true);
    this.setError(null);

    return this.http.get<Product[]>(this.baseUrl).pipe(
      tap(products => {

        this.setProducts(products);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setError('Erreur lors du chargement des produits');
        this.setLoading(false);
        return of([]);
      })
    );
  }

  getProductById(id: number): Observable<Product | null> {


    this.setLoading(true);
    this.setError(null);

    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      tap(product => {

        this.setLoading(false);
      }),
      catchError(error => {

        this.setError(`Erreur lors du chargement du produit ${id}`);
        this.setLoading(false);
        return of(null);
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {


    this.setLoading(true);
    this.setError(null);

    return this.http.get<Product[]>(`${this.baseUrl}/category/${category}`).pipe(
      tap(products => {

        this.setLoading(false);
      }),
      catchError(error => {

        this.setError(`Erreur lors du chargement de la catégorie ${category}`);
        this.setLoading(false);
        return of([]);
      })
    );
  }

  getCategories(): Observable<string[]> {


    return this.http.get<string[]>(`${this.baseUrl}/categories`).pipe(
      tap(categories => {

      }),
      catchError(error => {

        return of([]);
      })
    );
  }

  searchProducts(searchTerm: string): Observable<Product[]> {


    if (!searchTerm.trim()) {

      return this.getAllProducts();
    }

    return this.getAllProducts().pipe(
      map(products => {
        const filteredProducts = products.filter(product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );



        return filteredProducts;
      })
    );
  }

  sortProductsByPrice(products: Product[], ascending: boolean = true): Product[] {


    const sorted = [...products].sort((a, b) =>
      ascending ? a.price - b.price : b.price - a.price
    );



    return sorted;
  }

  filterProductsByPriceRange(products: Product[], minPrice: number, maxPrice: number): Product[] {


    const filtered = products.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );



    return filtered;
  }

  private setProducts(products: Product[]): void {
    this.productsSignal.set(products);
  }

  private setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  private setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  debugCurrentState(): {
    products: Product[];
    loading: boolean;
    error: string | null;
  } {
    const state = {
      products: this.products(),
      loading: this.loading(),
      error: this.error()
    };

    return state;
  }

  clearCache(): void {

    this.setProducts([]);
    this.setError(null);
    this.setLoading(false);
  }
}
