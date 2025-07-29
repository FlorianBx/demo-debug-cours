import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: { name: string };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class DemoApi {
  
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        delay(1000),
        map(users => users.map(user => ({
          ...user,
          email: user.email.toLowerCase()
        })))
      );
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(delay(800));
  }

  getPokemon(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      .pipe(delay(1200));
  }

  getFailingEndpoint(): Observable<any> {
    return this.http.get('https://httpstat.us/500')
      .pipe(delay(2000));
  }

  calculateTotal(items: number[]): number {
    const sum = items.reduce((acc, curr) => acc + curr, 0);
    const tax = sum * 0.08;
    const total = sum + tax;
    return Math.round(total * 100) / 100;
  }

  processUserData(users: User[]): any {
    const result = users
      .filter(user => user.email.includes('.'))
      .map(user => ({
        id: user.id,
        name: user.name,
        domain: user.email.split('@')[1]
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return result;
  }
}
