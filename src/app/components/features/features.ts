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
  template: `
    
    <section class="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container-responsive relative z-10">
        <div class="text-center max-w-5xl mx-auto">
          
          <div class="inline-flex items-center px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-6">
            <span class="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
            Advanced VPN Features
          </div>

          
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Powerful Features for
            <span class="text-gradient bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Complete Protection
            </span>
          </h1>

          
          <p class="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            Discover the comprehensive suite of security and privacy features that make Pivien VPN 
            the choice of millions worldwide.
          </p>

          
          <button 
            type="button"
            pButton
            class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
            (click)="navigateTo('/pricing')"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </section>

    
    <section class="py-20 bg-gradient-to-b from-black to-gray-900">
      <div class="container-responsive">
        
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Core VPN Features
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need for secure, private, and unrestricted internet access
          </p>
        </div>

        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div *ngFor="let feature of coreFeatures" class="card-dark p-8">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <div [innerHTML]="feature.icon" class="w-8 h-8 text-indigo-400"></div>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">{{ feature.title }}</h3>
            <p class="text-gray-400 mb-6 leading-relaxed">{{ feature.description }}</p>
            <ul class="space-y-2">
              <li *ngFor="let benefit of feature.benefits" class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-300 text-sm">{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    
    <section class="py-20 bg-gray-900">
      <div class="container-responsive">
        
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Military-Grade Security
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            Advanced encryption and security protocols to keep your data safe
          </p>
        </div>

        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div *ngFor="let feature of securityFeatures" class="flex space-x-6">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                <div [innerHTML]="feature.icon" class="w-8 h-8 text-red-400"></div>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-white mb-3">{{ feature.title }}</h3>
              <p class="text-gray-400 mb-4 leading-relaxed">{{ feature.description }}</p>
              <ul class="space-y-2">
                <li *ngFor="let detail of feature.details" class="flex items-start space-x-3">
                  <span class="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span class="text-gray-300 text-sm">{{ detail }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section class="py-20 bg-black">
      <div class="container-responsive">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
              Lightning-Fast Performance
            </h2>
            <p class="text-xl text-gray-400 mb-8 leading-relaxed">
              Experience the internet at full speed with our optimized global network. 
              Stream, game, and work without compromise.
            </p>
            
            
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50">
                <div class="text-3xl font-bold text-white mb-2">100+</div>
                <div class="text-gray-400 text-sm">Global Servers</div>
              </div>
              <div class="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50">
                <div class="text-3xl font-bold text-white mb-2">70+</div>
                <div class="text-gray-400 text-sm">Countries</div>
              </div>
              <div class="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50">
                <div class="text-3xl font-bold text-white mb-2">99.9%</div>
                <div class="text-gray-400 text-sm">Uptime</div>
              </div>
              <div class="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50">
                <div class="text-3xl font-bold text-white mb-2">10Gbps</div>
                <div class="text-gray-400 text-sm">Max Speed</div>
              </div>
            </div>

            <button 
              type="button"
              pButton
              class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
              (click)="navigateTo('/pricing')"
            >
              Start Your Free Trial
            </button>
          </div>

          
          <div class="relative">
            <div class="w-full h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-gray-700/50 flex items-center justify-center">
              <div class="text-center">
                <div class="w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-16 h-16 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Optimized Network</h3>
                <p class="text-gray-400">Global infrastructure for maximum performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section class="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div class="container-responsive">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Privacy & Compliance
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            Built with privacy-first principles and compliant with global regulations
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          <div class="card-dark p-8 text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Zero-Logs Policy</h3>
            <p class="text-gray-400 leading-relaxed">
              We don't collect, store, or share any of your personal data or browsing activities. 
              Your privacy is guaranteed.
            </p>
          </div>

          
          <div class="card-dark p-8 text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Privacy Jurisdiction</h3>
            <p class="text-gray-400 leading-relaxed">
              Headquartered in a privacy-friendly jurisdiction with strong data protection laws 
              and no mandatory data retention.
            </p>
          </div>

          
          <div class="card-dark p-8 text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Third-Party Audited</h3>
            <p class="text-gray-400 leading-relaxed">
              Our no-logs policy and security practices are regularly audited by independent 
              security firms to ensure transparency.
            </p>
          </div>
        </div>
      </div>
    </section>

    
    <section class="py-20 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20">
      <div class="container-responsive">
        <div class="text-center max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to experience true privacy?
          </h2>
          <p class="text-xl text-gray-300 mb-8 leading-relaxed">
            Join millions who trust Pivien VPN for secure, private, and unrestricted internet access.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              type="button"
              pButton
              class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
              (click)="navigateTo('/pricing')"
            >
              Start Free Trial
            </button>
            <button 
              type="button"
              class="px-8 py-4 bg-transparent border-2 border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300"
              (click)="navigateTo('/home')"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
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