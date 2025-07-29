import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { DemoApi, User, Post } from '../../services/demo-api';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-network-override-demo',
  imports: [JsonPipe],
  templateUrl: './network-override-demo.html',
  styleUrl: './network-override-demo.css'
})
export class NetworkOverrideDemo {
  
  // Working API data
  workingApiData = signal<User[] | null>(null);
  workingApiLoading = signal(false);
  posts = signal<Post[]>([]);
  postsLoading = signal(false);

  // Failing API data
  failingApiError = signal<string | null>(null);
  failingApiLoading = signal(false);
  slowApiData = signal<any>(null);
  slowApiLoading = signal(false);

  // UI state
  selectedTab = signal('users');

  // Sample data for overrides
  sampleUsers = `[
  {
    "id": 1,
    "name": "Override User",
    "email": "override@test.com",
    "phone": "123-456-7890",
    "website": "override.dev"
  },
  {
    "id": 2,
    "name": "Mock User 2", 
    "email": "mock@test.com",
    "phone": "098-765-4321",
    "website": "mock.dev"
  }
]`;

  samplePosts = `[
  {
    "id": 1,
    "userId": 1,
    "title": "Override Post Title",
    "body": "This is an override post content that you can use to test network overrides in Chrome DevTools."
  },
  {
    "id": 2,
    "userId": 1,
    "title": "Mock Post",
    "body": "Another mock post for testing purposes."
  }
]`;

  sampleError = `{
  "error": "Backend temporarily unavailable",
  "code": 503,
  "message": "Service is under maintenance. Try again later.",
  "timestamp": "${new Date().toISOString()}"
}`;

  constructor(private demoApi: DemoApi) {}

  testWorkingApi() {
    this.workingApiLoading.set(true);
    this.workingApiData.set(null);
    
    this.demoApi.getUsers().subscribe({
      next: (users) => {
        this.workingApiData.set(users);
        this.workingApiLoading.set(false);
      },
      error: (error) => {
        console.error('Error in working API:', error);
        this.workingApiLoading.set(false);
      }
    });
  }

  testPostsApi() {
    this.postsLoading.set(true);
    this.posts.set([]);

    this.demoApi.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.postsLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.postsLoading.set(false);
      }
    });
  }

  testFailingApi() {
    this.failingApiLoading.set(true);
    this.failingApiError.set(null);

    this.demoApi.getFailingEndpoint().subscribe({
      next: (data) => {
        // This shouldn't happen with the failing endpoint
        console.log('Unexpected success:', data);
        this.failingApiLoading.set(false);
      },
      error: (error) => {
        console.error('Expected error from failing API:', error);
        this.failingApiError.set(error.message || 'HTTP 500 - Internal Server Error');
        this.failingApiLoading.set(false);
      }
    });
  }

  simulateSlowApi() {
    this.slowApiLoading.set(true);
    this.slowApiData.set(null);

    // Simulate a slow API call
    of({ message: 'Slow API completed', timestamp: new Date().toISOString() })
      .pipe(delay(5000))
      .subscribe({
        next: (data) => {
          this.slowApiData.set(data);
          this.slowApiLoading.set(false);
        },
        error: (error) => {
          console.error('Slow API error:', error);
          this.slowApiLoading.set(false);
        }
      });
  }
}