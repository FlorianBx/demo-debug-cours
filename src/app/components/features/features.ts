import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface Feature {
  icon: string;
  title: string;
  description: string;
  benefits: string[];
}

interface SecurityFeature {
  title: string;
  description: string;
  icon: string;
  details: string[];
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './features.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Features {
  coreFeatures: Feature[] = [
    {
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>',
      title: 'Military-Grade Encryption',
      description: 'Your data is protected with AES-256 encryption, the same standard used by governments and militaries worldwide.',
      benefits: [
        'AES-256 encryption protocol',
        'Perfect Forward Secrecy',
        'Secure tunneling protocols'
      ]
    },
    {
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" /></svg>',
      title: 'Lightning-Fast Speeds',
      description: 'Optimized servers and advanced protocols ensure you get maximum speed without compromising security.',
      benefits: [
        'Unlimited bandwidth',
        'Optimized server network',
        'Smart server selection'
      ]
    },
    {
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>',
      title: 'Global Server Network',
      description: 'Access content from anywhere with our 100+ high-speed servers across 70+ countries worldwide.',
      benefits: [
        '100+ server locations',
        '70+ countries covered',
        'Automatic server optimization'
      ]
    },
    {
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>',
      title: 'Kill Switch Protection',
      description: 'Automatic protection that blocks all internet traffic if your VPN connection drops unexpectedly.',
      benefits: [
        'Automatic disconnect protection',
        'No data leaks',
        'Always-on security'
      ]
    },
    {
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd" /></svg>',
      title: 'Multi-Platform Support',
      description: 'Protect all your devices with native apps for Windows, Mac, iOS, Android, and more.',
      benefits: [
        'Up to 10 simultaneous connections',
        'Native apps for all platforms',
        'Easy setup and configuration'
      ]
    },
    {
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" /></svg>',
      title: '24/7 Expert Support',
      description: 'Get help whenever you need it from our dedicated team of security and privacy experts.',
      benefits: [
        'Live chat support',
        'Email assistance',
        'Comprehensive knowledge base'
      ]
    }
  ];

  securityFeatures: SecurityFeature[] = [
    {
      title: 'Advanced Encryption Protocols',
      description: 'Multiple layers of security ensure your data remains private and secure at all times.',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>',
      details: [
        'AES-256 military-grade encryption',
        'OpenVPN and WireGuard protocols',
        'Perfect Forward Secrecy (PFS)',
        'SHA-256 authentication'
      ]
    },
    {
      title: 'DNS & IP Leak Protection',
      description: 'Comprehensive leak protection ensures your real IP address and DNS queries never escape.',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>',
      details: [
        'DNS leak protection',
        'IPv4 and IPv6 leak protection',
        'WebRTC leak prevention',
        'Real-time leak monitoring'
      ]
    },
    {
      title: 'Split Tunneling',
      description: 'Choose which apps use the VPN while others connect directly, giving you complete control.',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd" /></svg>',
      details: [
        'App-based split tunneling',
        'Website-based tunneling',
        'Custom routing rules',
        'Bandwidth optimization'
      ]
    },
    {
      title: 'Advanced Threat Protection',
      description: 'Built-in protection against malware, phishing, and other online threats.',
      icon: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>',
      details: [
        'Malware blocking',
        'Phishing protection',
        'Ad and tracker blocking',
        'Real-time threat detection'
      ]
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}