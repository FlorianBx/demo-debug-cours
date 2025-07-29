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
  templateUrl: './pricing.html',
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