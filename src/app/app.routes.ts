import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then(m => m.Home)
  },
  {
    path: 'debugger-demo',
    loadComponent: () => import('./components/debugger-demo/debugger-demo').then(m => m.DebuggerDemo)
  },
  {
    path: 'call-stack-demo',
    loadComponent: () => import('./components/call-stack-demo/call-stack-demo').then(m => m.CallStackDemo)
  },
  {
    path: 'network-override-demo',
    loadComponent: () => import('./components/network-override-demo/network-override-demo').then(m => m.NetworkOverrideDemo)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
