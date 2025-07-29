import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CardModule, DividerModule, MessageModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
