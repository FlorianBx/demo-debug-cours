import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { MessageModule } from 'primeng/message';
import { DemoApi, User, Pokemon } from '../../services/demo-api';

@Component({
  selector: 'app-debugger-demo',
  imports: [FormsModule, ButtonModule, CardModule, TableModule, InputTextModule, DividerModule, ChipModule, MessageModule],
  templateUrl: './debugger-demo.html',
  styleUrl: './debugger-demo.css'
})
export class DebuggerDemo {
  
  // User data
  users = signal<User[]>([]);
  usersLoading = signal(false);
  processedData = signal<any[]>([]);

  // Pokemon data
  pokemon = signal<Pokemon | null>(null);
  pokemonName = signal('');
  pokemonLoading = signal(false);

  // Calculation data
  items = signal<number[]>([]);
  itemsInput = signal('');
  total = signal<number | null>(null);

  constructor(private demoApi: DemoApi) {}

  loadUsers() {
    this.usersLoading.set(true);
    this.demoApi.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.usersLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.usersLoading.set(false);
      }
    });
  }

  processUsers() {
    const currentUsers = this.users();
    const processed = this.demoApi.processUserData(currentUsers);
    this.processedData.set(processed);
  }

  calculateStats() {
    const currentUsers = this.users();
    const stats = {
      totalUsers: currentUsers.length,
      domains: [...new Set(currentUsers.map(u => u.email.split('@')[1]))],
      averageNameLength: currentUsers.reduce((acc, u) => acc + u.name.length, 0) / currentUsers.length
    };
    console.log('User Statistics:', stats);
  }

  searchPokemon() {
    const name = this.pokemonName();
    if (!name) return;

    this.pokemonLoading.set(true);
    this.demoApi.getPokemon(name).subscribe({
      next: (pokemon) => {
        this.pokemon.set(pokemon);
        this.pokemonLoading.set(false);
      },
      error: (error) => {
        console.error('Error searching Pokemon:', error);
        this.pokemonLoading.set(false);
        this.pokemon.set(null);
      }
    });
  }

  parseItems() {
    const input = this.itemsInput();
    if (!input) {
      this.items.set([]);
      return;
    }

    const numbers = input
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
    
    this.items.set(numbers);
  }

  calculateTotal() {
    const currentItems = this.items();
    const total = this.demoApi.calculateTotal(currentItems);
    this.total.set(total);
  }

  generateRandomItems() {
    const count = Math.floor(Math.random() * 8) + 3; // 3-10 items
    const randomItems = Array.from({ length: count }, () => 
      Math.round((Math.random() * 100 + 5) * 100) / 100 // $5-$105, 2 decimal places
    );
    
    this.items.set(randomItems);
    this.itemsInput.set(randomItems.join(', '));
    this.total.set(null);
  }

  getAverage(): number {
    const currentItems = this.items();
    if (currentItems.length === 0) return 0;
    const avg = currentItems.reduce((acc, curr) => acc + curr, 0) / currentItems.length;
    return Math.round(avg * 100) / 100;
  }

  getMax(): number {
    const currentItems = this.items();
    return currentItems.length > 0 ? Math.max(...currentItems) : 0;
  }
}