
import { loadStripe } from '@stripe/stripe-js';

// This would be your Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export class StripeService {
  private static baseUrl = '/api/stripe';

  static async createConnectAccountLink() {
    const response = await fetch(`${this.baseUrl}/connect/account-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_url: window.location.href,
        return_url: window.location.href + '?connected=true'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create account link');
    }

    return response.json();
  }

  static async getAccountStatus() {
    const response = await fetch(`${this.baseUrl}/account`);
    
    if (!response.ok) {
      throw new Error('Failed to get account status');
    }

    return response.json();
  }

  static async getBalance() {
    const response = await fetch(`${this.baseUrl}/balance`);
    
    if (!response.ok) {
      throw new Error('Failed to get balance');
    }

    return response.json();
  }

  static async getPayments(limit = 10) {
    const response = await fetch(`${this.baseUrl}/payments?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to get payments');
    }

    return response.json();
  }

  static async getCustomers(limit = 10) {
    const response = await fetch(`${this.baseUrl}/customers?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to get customers');
    }

    return response.json();
  }

  static async getProducts() {
    const response = await fetch(`${this.baseUrl}/products`);
    
    if (!response.ok) {
      throw new Error('Failed to get products');
    }

    return response.json();
  }

  static async createProduct(productData: any) {
    const response = await fetch(`${this.baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  }

  static async createPaymentIntent(amount: number, currency = 'usd') {
    const response = await fetch(`${this.baseUrl}/payment-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return response.json();
  }

  static async exportData(type: 'payments' | 'customers' | 'all') {
    const response = await fetch(`${this.baseUrl}/export/${type}`);
    
    if (!response.ok) {
      throw new Error('Failed to export data');
    }

    return response.blob();
  }

  static async createPayout(amount: number) {
    const response = await fetch(`${this.baseUrl}/payouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) {
      throw new Error('Failed to create payout');
    }

    return response.json();
  }

  static async disconnectAccount() {
    const response = await fetch(`${this.baseUrl}/disconnect`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to disconnect account');
    }

    return response.json();
  }
}
