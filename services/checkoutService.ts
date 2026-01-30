/**
 * Stripe Checkout Service
 * 
 * Creates Stripe Checkout sessions and handles payment flow.
 * The actual checkout session creation must happen on a backend server
 * for security (Stripe secret key should never be exposed to the client).
 * 
 * This service communicates with your backend API to create sessions.
 */

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { CartItem } from '../types';

// Your backend API endpoint that creates Stripe Checkout sessions
// For development, you can use ngrok or similar to expose local server
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend.com';

interface CheckoutParams {
  userId: string;
  userEmail: string;
  userName: string;
  cartItems: CartItem[];
  total: number;
}

interface LineItem {
  productId: string;
  productSlug?: string | { current: string };
  title: string;
  image?: string;
  quantity: number;
  price: number;
  numericPrice: number;
}

interface CheckoutResult {
  success: boolean;
  sessionId?: string;
  orderNumber?: string;
  result?: WebBrowser.WebBrowserResult;
  error?: string;
}

/**
 * Create a Stripe Checkout session and redirect the user
 * @param params - Checkout parameters
 * @returns Result with success status
 */
export const createCheckoutSession = async ({ userId, userEmail, userName, cartItems, total }: CheckoutParams): Promise<CheckoutResult> => {
  try {
    // Format line items for Stripe
    const lineItems: LineItem[] = cartItems.map(item => {
      // Parse price from various formats
      let price: number = item.numericPrice || (item.price as number) || 0;
      if (typeof price === 'string') {
        price = parseFloat((price as string).replace(/[^0-9.]/g, '')) || 0;
      }
      return {
        productId: item._id || item.id || '',
        productSlug: item.slug,
        title: item.title,
        image: item.image || item.productImage || item.uri,
        quantity: item.quantity || 1,
        price: price,
        numericPrice: price,
      };
    });

    // Create success and cancel URLs using deep linking
    const successUrl = Linking.createURL('checkout/success');
    const cancelUrl = Linking.createURL('checkout/cancel');

    // Call your backend API to create Stripe Checkout session
    const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userEmail,
        userName,
        lineItems,
        total,
        successUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const { checkoutUrl, sessionId, orderNumber } = await response.json();

    // Open Stripe Checkout in browser
    const result = await WebBrowser.openBrowserAsync(checkoutUrl, {
      showInRecents: true,
      createTask: true,
    });

    return {
      success: true,
      sessionId,
      orderNumber,
      result,
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

/**
 * Format currency for display
 * @param amount - Amount in dollars
 * @param currency - Currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};
