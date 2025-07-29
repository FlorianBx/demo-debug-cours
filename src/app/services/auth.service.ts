import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap, catchError } from 'rxjs';
import { User, LoginCredentials, AuthResponse, AuthState } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false
  });

  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly currentUser = computed(() => this.authState().user);
  readonly isLoading = computed(() => this.authState().loading);

  private readonly fakeUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@shop.com',
      name: { firstname: 'Admin', lastname: 'User' }
    },
    {
      id: 2,
      username: 'demo',
      email: 'demo@shop.com',
      name: { firstname: 'Demo', lastname: 'User' }
    }
  ];

  constructor() {
    this.checkStoredAuth();
    
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    
    
    this.authState.update(state => ({ ...state, loading: true }));

    return of(null).pipe(
      delay(1000),
      tap(() => {}),        
      tap(() => {
        const user = this.fakeUsers.find(u => 
          u.username === credentials.username && 
          (credentials.password === 'admin' || credentials.password === 'demo')
        );
        
        if (user) {
          
          this.setAuthenticatedUser(user);
          return { success: true, user };
        } else {
          
          this.authState.update(state => ({ ...state, loading: false }));
          return { success: false, message: 'Identifiants invalides' };
        }
      }),
      catchError(error => {
        
        this.authState.update(state => ({ ...state, loading: false }));
        return of({ success: false, message: 'Erreur de connexion' });
      })
    ) as Observable<AuthResponse>;
  }

  logout(): void {
    
    
    this.authState.set({
      isAuthenticated: false,
      user: null,
      loading: false
    });
    
    localStorage.removeItem('currentUser');
    
  }

  isAdmin(): boolean {
    const isAdmin = this.currentUser()?.username === 'admin';
    
    return isAdmin;
  }

  getUserFromApi(userId: number): Observable<User> {
    
    
    return this.http.get<User>(`https://fakestoreapi.com/users/${userId}`).pipe(
      tap(user => {}),        
      catchError(error => {
        
        throw error;
      })
    );
  }

  private setAuthenticatedUser(user: User): void {
    
    
    this.authState.set({
      isAuthenticated: true,
      user,
      loading: false
    });
    
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private checkStoredAuth(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        
        this.authState.set({
          isAuthenticated: true,
          user,
          loading: false
        });
      } catch (error) {
        
        localStorage.removeItem('currentUser');
      }
    }
  }

  debugCurrentState(): AuthState {
    const state = this.authState();
    
    return state;
  }
}