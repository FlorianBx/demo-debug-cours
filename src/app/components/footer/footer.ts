import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  route: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
  currentYear = new Date().getFullYear();

  footerSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', route: '/features' },
        { label: 'Pricing', route: '/pricing' },
        { label: 'Security', route: '/security' },
        { label: 'Downloads', route: '/downloads' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', route: '/help' },
        { label: 'Contact Us', route: '/contact' },
        { label: 'Setup Guides', route: '/guides' },
        { label: 'Status Page', route: 'https://status.pivien.com', external: true }
      ]
    }
  ];
}