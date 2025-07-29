import { Routes } from '@angular/router';

export const routes: Routes = [
  
  {
    path: '',
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'E-Shop - Nos Produits'
  },
  
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'E-Shop - Connexion'
  },
  
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
    title: 'E-Shop - Mon Panier'
  },
  
  
  {
    path: '**',
    redirectTo: ''
  }
];
