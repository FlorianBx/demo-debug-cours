import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
  featured?: boolean;
  badge?: string;
}

interface ComparisonFeature {
  feature: string;
  free: boolean | string;
  pro: boolean | string;
  premium: boolean | string;
}

interface FAQItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, AccordionModule],
  template: `
    
    <section class="relative min-h-[60vh] flex items-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container-responsive relative z-10">
        <div class="text-center max-w-4xl mx-auto">
          
          <div class="inline-flex items-center px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-6">
            <span class="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
            Special Launch Pricing
          </div>

          
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Choose Your
            <span class="text-gradient bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Protection
            </span>
          </h1>

          
          <p class="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Secure your digital life with military-grade encryption. 
            Choose the plan that fits your needs and start browsing safely today.
          </p>

          
          <div class="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>30-day money-back guarantee</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <span>Zero-logs policy</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span>Trusted by 10M+ users</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section class="py-20 bg-gradient-to-b from-black to-gray-900">
      <div class="container-responsive">
        
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            No hidden fees. No complicated tiers. Just pick the plan that works for you.
          </p>
        </div>

        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div 
            *ngFor="let plan of pricingPlans; trackBy: trackByPlanId" 
            class="pricing-card relative"
            [class.featured]="plan.featured"
          >
            
            <div *ngIf="plan.featured" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {{ plan.badge }}
              </div>
            </div>

            
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-white mb-2">{{ plan.name }}</h3>
              <p class="text-gray-400 mb-6">{{ plan.description }}</p>
              
              
              <div class="mb-6">
                <div class="flex items-baseline justify-center space-x-2">
                  <span class="text-5xl font-bold text-white">{{ plan.price }}</span>
                  <span class="text-gray-400 text-lg">{{ plan.period }}</span>
                </div>
                <div *ngIf="plan.originalPrice" class="mt-2">
                  <span class="text-gray-500 text-lg line-through">{{ plan.originalPrice }}</span>
                  <span class="ml-2 text-green-400 text-sm font-semibold">Save 50%</span>
                </div>
              </div>

              
              <button 
                pButton
                [class]="plan.buttonVariant === 'primary' ? 
                  'w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25' : 
                  'w-full py-4 bg-transparent border-2 border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300'"
                (click)="selectPlan(plan.id)"
              >
                {{ plan.buttonText }}
              </button>
            </div>

            
            <div class="space-y-4">
              <div *ngFor="let feature of plan.features" class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-300 leading-relaxed">{{ feature }}</span>
              </div>
            </div>
          </div>
        </div>

        
        <div class="text-center mt-12">
          <div class="inline-flex items-center px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-full text-green-300">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            30-day money-back guarantee on all plans
          </div>
        </div>
      </div>
    </section>

    
    <section class="py-20 bg-gray-900">
      <div class="container-responsive">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Compare Plans
          </h2>
          <p class="text-xl text-gray-400">
            See exactly what's included in each plan
          </p>
        </div>

        <div class="max-w-6xl mx-auto overflow-x-auto">
          <table class="w-full bg-gray-800/50 rounded-2xl overflow-hidden">
            <thead>
              <tr class="bg-gray-800">
                <th class="text-left py-6 px-6 text-white font-semibold">Features</th>
                <th class="text-center py-6 px-6 text-white font-semibold">Free</th>
                <th class="text-center py-6 px-6 text-white font-semibold">
                  <div class="relative">
                    Pro
                    <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                      <span class="bg-indigo-600 text-white text-xs px-2 py-1 rounded">Popular</span>
                    </div>
                  </div>
                </th>
                <th class="text-center py-6 px-6 text-white font-semibold">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of comparisonFeatures; let i = index" 
                  [class]="i % 2 === 0 ? 'bg-gray-800/30' : 'bg-transparent'">
                <td class="py-4 px-6 text-gray-300 font-medium">{{ item.feature }}</td>
                <td class="py-4 px-6 text-center">
                  <span *ngIf="item.free === true" class="text-green-400">
                    <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span *ngIf="item.free === false" class="text-gray-500">
                    <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span *ngIf="typeof item.free === 'string'" class="text-gray-300 text-sm">{{ item.free }}</span>
                </td>
                <td class="py-4 px-6 text-center">
                  <span *ngIf="item.pro === true" class="text-green-400">
                    <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span *ngIf="item.pro === false" class="text-gray-500">
                    <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span *ngIf="typeof item.pro === 'string'" class="text-gray-300 text-sm">{{ item.pro }}</span>
                </td>
                <td class="py-4 px-6 text-center">
                  <span *ngIf="item.premium === true" class="text-green-400">
                    <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span *ngIf="item.premium === false" class="text-gray-500">
                    <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span *ngIf="typeof item.premium === 'string'" class="text-gray-300 text-sm">{{ item.premium }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    
    <section class="py-20 bg-black">
      <div class="container-responsive">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p class="text-xl text-gray-400">
            Everything you need to know about our VPN service
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <p-accordion>
            <p-accordion-panel 
              *ngFor="let faq of faqItems; let i = index"
              [value]="i.toString()"
            >
              <p-accordion-header>
                <span class="text-white font-medium">{{ faq.question }}</span>
              </p-accordion-header>
              <p-accordion-content>
                <div class="text-gray-300 leading-relaxed pt-4">
                  {{ faq.answer }}
                </div>
              </p-accordion-content>
            </p-accordion-panel>
          </p-accordion>
        </div>
      </div>
    </section>

    
    <section class="py-20 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20">
      <div class="container-responsive">
        <div class="text-center max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to secure your digital life?
          </h2>
          <p class="text-xl text-gray-300 mb-8 leading-relaxed">
            Join millions of users who trust Pivien VPN to protect their privacy and access content worldwide.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              pButton
              class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
              (click)="selectPlan('pro')"
            >
              Start Free Trial
            </button>
            <button 
              pButton
              class="px-8 py-4 bg-transparent border-2 border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300"
              (click)="navigateToContact()"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pricing {
  isAnnual = signal(true);

  pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out our service',
      features: [
        '1 device connection',
        '3 server locations',
        '500MB monthly data',
        'Basic encryption',
        'Email support'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'secondary'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$2.99',
      originalPrice: '$5.99',
      period: '/month',
      description: 'Best value for personal use',
      features: [
        '5 device connections',
        '50+ server locations',
        'Unlimited bandwidth',
        'Military-grade encryption',
        'Kill switch protection',
        '24/7 live chat support',
        'No-logs policy'
      ],
      buttonText: 'Choose Pro',
      buttonVariant: 'primary',
      featured: true,
      badge: 'Most Popular'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$6.99',
      originalPrice: '$12.99',
      period: '/month',
      description: 'Maximum protection for families',
      features: [
        '10 device connections',
        '100+ server locations in 70+ countries',
        'Unlimited bandwidth',
        'Military-grade encryption',
        'Kill switch & split tunneling',
        'Dedicated IP addresses',
        'Priority 24/7 support',
        'Advanced malware protection',
        'Ad & tracker blocking'
      ],
      buttonText: 'Choose Premium',
      buttonVariant: 'secondary'
    }
  ];

  comparisonFeatures: ComparisonFeature[] = [
    { feature: 'Device connections', free: '1', pro: '5', premium: '10' },
    { feature: 'Server locations', free: '3', pro: '50+', premium: '100+' },
    { feature: 'Bandwidth', free: '500MB/month', pro: 'Unlimited', premium: 'Unlimited' },
    { feature: 'Encryption', free: true, pro: true, premium: true },
    { feature: 'Kill switch', free: false, pro: true, premium: true },
    { feature: 'Split tunneling', free: false, pro: false, premium: true },
    { feature: 'Dedicated IP', free: false, pro: false, premium: true },
    { feature: 'Ad blocking', free: false, pro: false, premium: true },
    { feature: 'Malware protection', free: false, pro: false, premium: true },
    { feature: '24/7 Support', free: false, pro: true, premium: true }
  ];

  faqItems: FAQItem[] = [
    {
      question: 'What is a VPN and why do I need one?',
      answer: 'A VPN (Virtual Private Network) creates a secure, encrypted connection between your device and the internet. It protects your privacy by hiding your IP address and encrypting your data, making it essential for secure browsing, especially on public Wi-Fi networks.'
    },
    {
      question: 'How many devices can I connect simultaneously?',
      answer: 'This depends on your plan. Free users get 1 device, Pro users get 5 devices, and Premium users can connect up to 10 devices simultaneously. All connections are protected with the same high-level security.'
    },
    {
      question: 'Do you keep logs of my activity?',
      answer: 'No, we have a strict zero-logs policy. We do not collect, store, or share any information about your online activities, browsing history, or connection logs. Your privacy is our top priority.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time through your account dashboard. We also offer a 30-day money-back guarantee on all paid plans, so you can try our service risk-free.'
    },
    {
      question: 'Will the VPN slow down my internet connection?',
      answer: 'While any VPN may cause a slight decrease in speed due to encryption, our optimized servers and protocols minimize this impact. Most users experience no noticeable difference in their browsing experience.'
    },
    {
      question: 'Is it legal to use a VPN?',
      answer: 'Yes, using a VPN is legal in most countries around the world. However, we encourage users to comply with local laws and terms of service of websites and applications they access.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various cryptocurrencies for maximum privacy and convenience.'
    },
    {
      question: 'How do I get started?',
      answer: 'Simply choose your plan, create an account, and download our app for your device. Our setup guides and 24/7 support team are here to help you get connected in minutes.'
    }
  ];

  constructor(private router: Router) {}

  trackByPlanId(index: number, plan: PricingPlan): string {
    return plan.id;
  }

  selectPlan(planId: string): void {
    
    this.router.navigate(['/signup'], { queryParams: { plan: planId } });
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}