import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = 'Chrome DevTools Debugging Demo';

  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => this.router.navigate(['/home'])
    },
    {
      label: 'API Demo',
      icon: 'pi pi-code',
      command: () => this.router.navigate(['/debugger-demo'])
    },
    {
      label: 'Network Demo',
      icon: 'pi pi-globe',
      command: () => this.router.navigate(['/network-override-demo'])
    }
  ];

  constructor(private router: Router) {}
}
